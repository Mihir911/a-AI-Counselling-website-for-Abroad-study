const { GoogleGenerativeAI } = require("@google/generative-ai");
const Profile = require("../models/Profile");
const Shortlist = require("../models/Shortlist");
const User = require("../models/User");
const Chat = require("../models/Chat");

// Init Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

// Helper: build context for AI
async function buildContext(userId) {
    const profile = await Profile.findOne({ userId });
    const shortlist = await Shortlist.find({ userId }).populate("universityId");
    const user = await User.findById(userId);

    return { profile, shortlist, user };
}

// Helper: get recent chat history
async function getRecentChat(userId, limit = 8) {
    const chat = await Chat.findOne({ userId });
    if (!chat) return [];
    return chat.messages.slice(-limit);
}

// System prompt builder
function buildSystemPrompt(profile, shortlist, user) {
    return `
You are an AI Study-Abroad Counsellor. Respond concisely (max 300 words), do not greet unnecessarily. Base advice on user profile and shortlist.

PROFILE:
Education: ${profile.educationLevel} ${profile.degree} (${profile.graduationYear})
GPA: ${profile.gpa || "N/A"}
Target Degree: ${profile.intendedDegree}, Field: ${profile.fieldOfStudy}
Intake: ${profile.targetIntake}, Countries: ${profile.preferredCountries.join(", ")}
Budget: ${profile.budgetRange}, Funding: ${profile.fundingPlan}
IELTS: ${profile.ieltsStatus} ${profile.ieltsScore || ""}, GRE: ${profile.greStatus} ${profile.greScore || ""}
SOP: ${profile.sopStatus}

CURRENT STAGE: ${user.currentStage}

SHORTLIST:
${shortlist.length === 0 ? "None" : shortlist.map(s => `${s.universityId.name} | ${s.category} | ${s.locked ? "LOCKED" : "UNLOCKED"}`).join("\n")}

RULES:
- Analyze profile immediately on first message.
- Be concise, direct, and actionable.
- Label universities as Dream / Target / Safe.
- NEVER hallucinate universities.
`;
}

// ====================
// CHAT ROUTE
// ====================
exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;

        if (!message) return res.status(400).json({ message: "Message required" });

        const { profile, shortlist, user } = await buildContext(userId);
        if (!profile) return res.status(400).json({ message: "Complete onboarding first" });

        const chatHistory = await getRecentChat(userId);

        const prompt = `
${buildSystemPrompt(profile, shortlist, user)}

CHAT HISTORY:
${chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

USER MESSAGE:
${message}
`;

        const result = await model.generateContent(prompt);
        const aiMessage = result.response.text();

        // Save chat
        let chat = await Chat.findOne({ userId });
        if (!chat) chat = await Chat.create({ userId, messages: [] });
        chat.messages.push({ role: 'assistant', content: aiMessage });
        chat.messages.push({ role: 'user', content: message }); // optional: store user message
        await chat.save();

        res.json({ message: aiMessage });
    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ message: "AI service failed" });
    }
};

// ====================
// HISTORY ROUTES
// ====================
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findOne({ userId });
        res.json(chat?.messages || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.clearHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        await Chat.findOneAndUpdate({ userId }, { messages: [] });
        res.json({ message: "Chat history cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ====================
// PROFILE ANALYSIS
// ====================
exports.analyzeProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await Profile.findOne({ userId });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        const strength = {
            academics: profile.gpa >= 8 ? 'strong' : profile.gpa >= 6 ? 'average' : 'weak',
            exams: ['completed'].includes(profile.ieltsStatus) && ['completed'].includes(profile.greStatus) ? 'completed' : 'in_progress',
            sop: profile.sopStatus,
            overall: 0
        };

        // Simple scoring
        let score = 0;
        if (strength.academics === 'strong') score += 40;
        else if (strength.academics === 'average') score += 25;
        else score += 10;

        if (strength.exams === 'completed') score += 30;
        else if (strength.exams === 'in_progress') score += 15;

        if (profile.sopStatus === 'ready') score += 30;
        else if (profile.sopStatus === 'draft') score += 15;

        strength.overall = score;

        res.json({ analysis: `Academics: ${strength.academics}, Exams: ${strength.exams}, SOP: ${strength.sop}, Overall Score: ${strength.overall}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
