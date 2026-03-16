import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  // Instagram Templates
  {
    name: "Product Launch",
    nameTr: "Urun Lansmani",
    description: "Announce a new product with excitement and key features",
    descriptionTr: "Yeni bir urunu heyecanla ve temel ozelliklerle duyurun",
    platform: "instagram",
    tone: "inspirational",
    category: "product-launch",
    promptTemplate: "Generate an exciting Instagram caption for a new product launch. Product: {{topic}}. Highlight key features, create FOMO, and include a strong CTA.",
    exampleOutput: "Something amazing is here! Introducing our latest innovation that will change the way you...",
  },
  {
    name: "Behind the Scenes",
    nameTr: "Sahne Arkasi",
    description: "Share your creative process or daily operations",
    descriptionTr: "Yaratici sureci veya gunluk operasyonlari paylasin",
    platform: "instagram",
    tone: "casual",
    category: "behind-the-scenes",
    promptTemplate: "Create a casual, authentic Instagram caption showing behind-the-scenes of: {{topic}}. Make it feel personal and relatable.",
    exampleOutput: "Ever wondered what goes on behind the camera? Here's a sneak peek into...",
  },
  {
    name: "Inspirational Quote",
    nameTr: "Ilham Verici Alinti",
    description: "Share a powerful quote with personal reflection",
    descriptionTr: "Guclu bir alintiyi kisisel dusunceyle paylasin",
    platform: "instagram",
    tone: "inspirational",
    category: "quote",
    promptTemplate: "Write an inspirational Instagram caption around this theme: {{topic}}. Include a meaningful quote (original or attributed) and a personal reflection.",
  },
  {
    name: "Tutorial / How-To",
    nameTr: "Egitim / Nasil Yapilir",
    description: "Step-by-step educational content",
    descriptionTr: "Adim adim egitici icerik",
    platform: "instagram",
    tone: "educational",
    category: "tutorial",
    promptTemplate: "Create an educational Instagram caption explaining how to: {{topic}}. Use numbered steps, clear language, and encourage saves.",
  },
  {
    name: "Engagement Question",
    nameTr: "Etkilesim Sorusu",
    description: "Ask your audience a compelling question",
    descriptionTr: "Kitlenize ilgi cekici bir soru sorun",
    platform: "instagram",
    tone: "casual",
    category: "engagement",
    promptTemplate: "Write an Instagram caption that asks an engaging question about: {{topic}}. Start with a hook, share a brief thought, then ask a question that encourages comments.",
  },
  {
    name: "Promotion / Sale",
    nameTr: "Promosyon / Indirim",
    description: "Announce a sale or special offer",
    descriptionTr: "Bir indirim veya ozel teklifi duyurun",
    platform: "instagram",
    tone: "motivational",
    category: "promotion",
    promptTemplate: "Write an urgent, exciting Instagram caption for this promotion: {{topic}}. Create urgency, highlight the value, and include a clear CTA.",
  },
  {
    name: "Before & After",
    nameTr: "Once ve Sonra",
    description: "Showcase transformation or results",
    descriptionTr: "Donusum veya sonuclari sergileyin",
    platform: "instagram",
    tone: "storytelling",
    category: "before-after",
    promptTemplate: "Create a compelling before/after Instagram caption about: {{topic}}. Tell the transformation story, include specific results, and inspire action.",
  },
  {
    name: "Milestone Celebration",
    nameTr: "Basari Kutlamasi",
    description: "Celebrate an achievement with your community",
    descriptionTr: "Toplulugunuzla bir basariyi kutlayin",
    platform: "instagram",
    tone: "motivational",
    category: "milestone",
    promptTemplate: "Write a celebratory Instagram caption for this milestone: {{topic}}. Thank your audience, share the journey, and look forward.",
  },
  {
    name: "Contest / Giveaway",
    nameTr: "Yarisma / Cekilis",
    description: "Run a contest or giveaway",
    descriptionTr: "Bir yarisma veya cekilis duzenlyin",
    platform: "instagram",
    tone: "casual",
    category: "contest",
    promptTemplate: "Create an exciting giveaway/contest Instagram caption about: {{topic}}. Include clear rules (like, comment, share, tag), deadline, and prize details.",
  },
  {
    name: "Tips & Tricks",
    nameTr: "Ipuclari ve Puf Noktalari",
    description: "Share valuable tips in your niche",
    descriptionTr: "Nis alaninizdaki degerli ipuclarini paylasin",
    platform: "instagram",
    tone: "educational",
    category: "tips-tricks",
    promptTemplate: "Write an Instagram caption sharing expert tips about: {{topic}}. Use bullet points or numbered format, provide actionable advice, and encourage saves.",
  },
  // TikTok Templates
  {
    name: "TikTok Hook Opener",
    nameTr: "TikTok Hook Acilis",
    description: "Attention-grabbing TikTok caption with a strong hook",
    descriptionTr: "Guclu bir hook ile dikkat cekici TikTok caption'i",
    platform: "tiktok",
    tone: "provocative",
    category: "engagement",
    promptTemplate: "Write a TikTok caption with a POWERFUL hook that stops the scroll. Topic: {{topic}}. Start with a controversial or surprising statement. Keep it short and punchy.",
  },
  {
    name: "TikTok Tutorial",
    nameTr: "TikTok Egitim",
    description: "Educational TikTok with numbered steps",
    descriptionTr: "Numaralandirilmis adimlarla egitici TikTok",
    platform: "tiktok",
    tone: "educational",
    category: "tutorial",
    promptTemplate: "Create a short, punchy TikTok caption for a tutorial about: {{topic}}. Use 'Wait for it...' style hooks and keep under 150 characters.",
  },
  {
    name: "TikTok Storytime",
    nameTr: "TikTok Hikaye",
    description: "Story-based TikTok caption",
    descriptionTr: "Hikaye tabanli TikTok caption",
    platform: "tiktok",
    tone: "storytelling",
    category: "storytelling",
    promptTemplate: "Write a TikTok storytime caption about: {{topic}}. Start with 'storytime:', create suspense, and end with a cliffhanger or punchline.",
  },
  {
    name: "TikTok Challenge",
    nameTr: "TikTok Meydan Okuma",
    description: "Launch or participate in a TikTok challenge",
    descriptionTr: "Bir TikTok meydan okumasini baslatin veya katlin",
    platform: "tiktok",
    tone: "funny",
    category: "engagement",
    promptTemplate: "Create a viral TikTok challenge caption about: {{topic}}. Make it fun, easy to participate, and include a challenge hashtag.",
  },
  // Twitter/X Templates
  {
    name: "Twitter Thread Opener",
    nameTr: "Twitter Thread Acilisi",
    description: "Start a compelling Twitter thread",
    descriptionTr: "Ilgi cekici bir Twitter thread'i baslatin",
    platform: "twitter",
    tone: "educational",
    category: "tutorial",
    promptTemplate: "Write a compelling Twitter/X thread opener (under 280 chars) about: {{topic}}. Make it impossible not to click 'Read more'. Use a bold claim or surprising stat.",
  },
  {
    name: "Twitter Hot Take",
    nameTr: "Twitter Provokatif Gorus",
    description: "Share a bold opinion",
    descriptionTr: "Cesur bir gorus paylasin",
    platform: "twitter",
    tone: "provocative",
    category: "engagement",
    promptTemplate: "Write a bold, attention-grabbing tweet about: {{topic}}. Be controversial but thoughtful. Under 280 characters. Designed to get replies and retweets.",
  },
  {
    name: "Twitter Tip",
    nameTr: "Twitter Ipucu",
    description: "Share a quick, valuable tip",
    descriptionTr: "Hizli ve degerli bir ipucu paylasin",
    platform: "twitter",
    tone: "professional",
    category: "tips-tricks",
    promptTemplate: "Write a concise, high-value tweet sharing a tip about: {{topic}}. Under 280 characters. Make it instantly actionable and shareable.",
  },
  // LinkedIn Templates
  {
    name: "LinkedIn Thought Leadership",
    nameTr: "LinkedIn Dusunce Liderligi",
    description: "Share industry insights and expertise",
    descriptionTr: "Sektor icgorulerini ve uzmanliginizi paylasin",
    platform: "linkedin",
    tone: "professional",
    category: "engagement",
    promptTemplate: "Write a LinkedIn post sharing thought leadership on: {{topic}}. Start with a hook, share insights from experience, provide value, and end with a question.",
  },
  {
    name: "LinkedIn Career Story",
    nameTr: "LinkedIn Kariyer Hikayesi",
    description: "Share a career lesson or experience",
    descriptionTr: "Bir kariyer dersi veya deneyimi paylasin",
    platform: "linkedin",
    tone: "storytelling",
    category: "storytelling",
    promptTemplate: "Write a LinkedIn post telling a career story about: {{topic}}. Be vulnerable, share the lesson learned, and connect it to a broader professional insight.",
  },
  {
    name: "LinkedIn Announcement",
    nameTr: "LinkedIn Duyuru",
    description: "Professional announcement or news",
    descriptionTr: "Profesyonel duyuru veya haber",
    platform: "linkedin",
    tone: "professional",
    category: "announcement",
    promptTemplate: "Write a professional LinkedIn announcement about: {{topic}}. Be clear, highlight the impact, and thank relevant people.",
  },
  // Facebook Templates
  {
    name: "Facebook Community Post",
    nameTr: "Facebook Topluluk Paylasimi",
    description: "Engage your Facebook community",
    descriptionTr: "Facebook toplulugunuzla etkilesim kurun",
    platform: "facebook",
    tone: "casual",
    category: "engagement",
    promptTemplate: "Write a warm, engaging Facebook post about: {{topic}}. Be conversational, ask for opinions, and encourage sharing.",
  },
  {
    name: "Facebook Event Promo",
    nameTr: "Facebook Etkinlik Tanitimi",
    description: "Promote an event on Facebook",
    descriptionTr: "Facebook'ta bir etkinligi tanitlin",
    platform: "facebook",
    tone: "motivational",
    category: "announcement",
    promptTemplate: "Write an exciting Facebook post promoting this event: {{topic}}. Include key details (what, when, where), create excitement, and include a CTA to RSVP.",
  },
  // YouTube Templates
  {
    name: "YouTube Video Description",
    nameTr: "YouTube Video Aciklamasi",
    description: "SEO-optimized YouTube video description",
    descriptionTr: "SEO-optimize YouTube video aciklamasi",
    platform: "youtube",
    tone: "educational",
    category: "tutorial",
    promptTemplate: "Write an SEO-optimized YouTube video description for: {{topic}}. Include a summary, timestamps placeholder, relevant keywords, and a subscribe CTA.",
  },
  {
    name: "YouTube Shorts Caption",
    nameTr: "YouTube Shorts Caption",
    description: "Short, catchy caption for YouTube Shorts",
    descriptionTr: "YouTube Shorts icin kisa, akilda kalici caption",
    platform: "youtube",
    tone: "casual",
    category: "engagement",
    promptTemplate: "Write a short, catchy YouTube Shorts caption about: {{topic}}. Hook viewers in the first line, keep it brief, and include relevant tags.",
  },
  // Pinterest Templates
  {
    name: "Pinterest Pin Description",
    nameTr: "Pinterest Pin Aciklamasi",
    description: "SEO-rich Pinterest pin description",
    descriptionTr: "SEO-zengin Pinterest pin aciklamasi",
    platform: "pinterest",
    tone: "educational",
    category: "tutorial",
    promptTemplate: "Write a Pinterest-optimized pin description for: {{topic}}. Include relevant keywords naturally, describe the value, and include a CTA to click.",
  },
  {
    name: "Pinterest Idea Pin",
    nameTr: "Pinterest Fikir Pin'i",
    description: "Multi-step idea pin narrative",
    descriptionTr: "Cok adimli fikir pin'i anlatimi",
    platform: "pinterest",
    tone: "inspirational",
    category: "tutorial",
    promptTemplate: "Write a Pinterest Idea Pin caption for: {{topic}}. Make it inspiring, searchable, and include step-by-step language.",
  },
  // Multi-Platform Templates
  {
    name: "Seasonal / Holiday Post",
    nameTr: "Mevsimsel / Tatil Paylasimi",
    description: "Holiday or seasonal themed caption",
    descriptionTr: "Tatil veya mevsimsel temali caption",
    platform: "all",
    tone: "casual",
    category: "seasonal",
    promptTemplate: "Write a festive caption for {{topic}}. Match the seasonal mood, be warm and inclusive, and tie it to your brand or niche.",
  },
  {
    name: "User-Generated Content",
    nameTr: "Kullanici Icerigi",
    description: "Share and celebrate user/customer content",
    descriptionTr: "Kullanici/musteri icerigini paylasin ve kutlayin",
    platform: "all",
    tone: "casual",
    category: "user-generated",
    promptTemplate: "Write a caption for sharing user-generated content about: {{topic}}. Credit the creator, express genuine appreciation, and encourage more UGC.",
  },
  {
    name: "Collaboration Announcement",
    nameTr: "Is Birligi Duyurusu",
    description: "Announce a brand or creator collaboration",
    descriptionTr: "Bir marka veya icerik uretici is birligini duyurun",
    platform: "all",
    tone: "motivational",
    category: "collaboration",
    promptTemplate: "Write an exciting collaboration announcement caption about: {{topic}}. Build hype, tag the collaborator, and preview what's coming.",
  },
  {
    name: "Funny / Meme Caption",
    nameTr: "Komik / Meme Caption",
    description: "Humorous caption with internet humor",
    descriptionTr: "Internet mizahi ile komik caption",
    platform: "all",
    tone: "funny",
    category: "engagement",
    promptTemplate: "Write a funny, meme-worthy caption about: {{topic}}. Use internet humor, be relatable, and make people want to tag their friends.",
  },
  {
    name: "Motivational Monday",
    nameTr: "Motive Edici Pazartesi",
    description: "Weekly motivational content",
    descriptionTr: "Haftalik motive edici icerik",
    platform: "all",
    tone: "motivational",
    category: "engagement",
    promptTemplate: "Write a motivational caption for the start of the week about: {{topic}}. Be uplifting, share a powerful mindset shift, and energize your audience.",
  },
];

async function main() {
  console.log("Seeding database with templates...");

  // Create default settings
  await prisma.appSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      defaultModel: "llama3",
      defaultLanguage: "tr",
      defaultPlatform: "instagram",
      defaultTone: "casual",
    },
  });

  // Create templates
  for (const template of templates) {
    await prisma.template.create({
      data: {
        ...template,
        isBuiltIn: true,
      },
    });
  }

  console.log(`Created ${templates.length} templates`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
