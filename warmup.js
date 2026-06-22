const nodemailer = require('nodemailer');

// 1. Establish connection to your domain's SMTP server
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 2. Realistic templates to simulate natural human phrasing
const subjects = [
    "Quick question regarding schedule", 
    "Follow up from last week's notes", 
    "Notes on the upcoming launch sync", 
    "Checking in on project status update"
];
const bodies = [
    "Hey, just wanted to check if you had time to review those slides? Let me know when you can.",
    "Hi there, let me know your availability for a quick sync tomorrow afternoon or Thursday.",
    "Attached are the notes we discussed earlier. Let me know if anything looks off or missing.",
    "Checking in to see if we are still on track for the deliverables this Friday. Thanks!"
];

// 3. Your pool of free seed recipient accounts (Gmail, Outlook, Yahoo)
// Change these to the personal test accounts you have access to!
const recipients = [
    'dickehebert@gmail.com',
    'rengarajan03@icloud.com',
    'rengarajan03@live.com'
];

async function runWarmup() {
    // Defines how many emails to send today (defaulting to 3 if not specified)
    const targetCount = Math.min(recipients.length, parseInt(process.env.DAILY_VOLUME || '3'));
    
    // Shuffle the recipient list to ensure randomness
    const shuffled = recipients.sort(() => 0.5 - Math.random());
    const selectedRecipients = shuffled.slice(0, targetCount);

    console.log(`Starting warmup batch. Target sending volume: ${targetCount}`);

    for (const email of selectedRecipients) {
        const randomSubj = subjects[Math.floor(Math.random() * subjects.length)];
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];

        try {
            await transporter.sendMail({
                from: `"Sender Name" <${process.env.SMTP_USER}>`,
                to: email,
                subject: randomSubj,
                text: randomBody,
            });
            console.log(`✅ Successfully sent warmup email to: ${email}`);
            
            // Wait 30 to 60 seconds between emails to mimic human behavior
            const delay = Math.random() * 30000 + 30000;
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            console.error(`❌ Failed sending to ${email}:`, error);
        }
    }
}

runWarmup();
