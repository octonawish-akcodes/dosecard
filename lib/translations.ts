import type { Food, LangCode, Time, Unit } from "./types";

/**
 * Fixed card labels per language. Machine-drafted and reviewed only for Hindi so far;
 * corrections from native speakers are welcome (see README).
 */
export type Labels = {
  /** The language's name in its own script, for the picker. */
  name: string;
  dir: "ltr" | "rtl";
  title: string;
  times: Record<Time, string>;
  food: Record<Food, string>;
  /** [singular, plural] */
  units: Record<Unit, [string, string]>;
  call: string;
  made: string;
  disclaimer: string;
  /** Heading of the picture key at the foot of the card. */
  key: string;
  /** Under the QR code on the card. */
  listen: string;
  /** The talking card page. */
  playAll: string;
  tapTime: string;
};

const L = (
  name: string,
  title: string,
  times: [string, string, string, string, string],
  food: [string, string, string, string],
  units: [[string, string], [string, string], [string, string], [string, string], [string, string], [string, string], [string, string]],
  call: string,
  made: string,
  disclaimer: string,
  dir: "ltr" | "rtl" = "ltr",
): Labels => ({
  name,
  dir,
  title,
  times: { morning: times[0], afternoon: times[1], evening: times[2], night: times[3], needed: times[4] },
  food: { before: food[0], after: food[1], with: food[2], any: food[3] },
  units: { tablet: units[0], capsule: units[1], ml: units[2], drops: units[3], puff: units[4], sachet: units[5], other: units[6] },
  call,
  made,
  disclaimer,
  key: "",
  listen: "",
  playAll: "",
  tapTime: "",
});

export const LABELS: Record<LangCode, Labels> = {
  en: L(
    "English only", "Medicine timetable",
    ["Morning", "Afternoon", "Evening", "Night", "Only when needed"],
    ["Before food", "After food", "With food", "Any time"],
    [["tablet", "tablets"], ["capsule", "capsules"], ["ml", "ml"], ["drop", "drops"], ["puff", "puffs"], ["sachet", "sachets"], ["dose", "doses"]],
    "If unsure, call", "Made on", "Copied from the prescription. Check with your doctor or pharmacist.",
  ),
  hi: L(
    "हिन्दी", "दवाई की समय-सारणी",
    ["सुबह", "दोपहर", "शाम", "रात", "ज़रूरत होने पर ही"],
    ["खाने से पहले", "खाने के बाद", "खाने के साथ", "कभी भी"],
    [["गोली", "गोलियाँ"], ["कैप्सूल", "कैप्सूल"], ["मि.ली.", "मि.ली."], ["बूँद", "बूँदें"], ["पफ़", "पफ़"], ["पाउच", "पाउच"], ["खुराक", "खुराक"]],
    "शक हो तो फ़ोन करें", "बनाने की तारीख़:", "पर्चे से लिखा गया है। अपने डॉक्टर या फ़ार्मासिस्ट से पक्का कर लें।",
  ),
  bn: L(
    "বাংলা", "ওষুধের সময়সূচি",
    ["সকাল", "দুপুর", "সন্ধ্যা", "রাত", "শুধু দরকার হলে"],
    ["খাবারের আগে", "খাবারের পরে", "খাবারের সাথে", "যেকোনো সময়"],
    [["ট্যাবলেট", "ট্যাবলেট"], ["ক্যাপসুল", "ক্যাপসুল"], ["মিলি", "মিলি"], ["ফোঁটা", "ফোঁটা"], ["পাফ", "পাফ"], ["স্যাশে", "স্যাশে"], ["ডোজ", "ডোজ"]],
    "সন্দেহ হলে ফোন করুন", "তৈরির তারিখ:", "প্রেসক্রিপশন থেকে লেখা। ডাক্তার বা ফার্মাসিস্টের সঙ্গে মিলিয়ে নিন।",
  ),
  mr: L(
    "मराठी", "औषधांचे वेळापत्रक",
    ["सकाळ", "दुपार", "संध्याकाळ", "रात्र", "गरज असेल तेव्हाच"],
    ["जेवणापूर्वी", "जेवणानंतर", "जेवणासोबत", "कधीही"],
    [["गोळी", "गोळ्या"], ["कॅप्सूल", "कॅप्सूल"], ["मि.ली.", "मि.ली."], ["थेंब", "थेंब"], ["पफ", "पफ"], ["सॅशे", "सॅशे"], ["डोस", "डोस"]],
    "शंका असल्यास फोन करा", "बनवल्याची तारीख:", "प्रिस्क्रिप्शनवरून लिहिले आहे. डॉक्टर किंवा फार्मासिस्टकडून खात्री करा.",
  ),
  te: L(
    "తెలుగు", "మందుల సమయ పట్టిక",
    ["ఉదయం", "మధ్యాహ్నం", "సాయంత్రం", "రాత్రి", "అవసరమైనప్పుడు మాత్రమే"],
    ["భోజనానికి ముందు", "భోజనం తర్వాత", "భోజనంతో పాటు", "ఎప్పుడైనా"],
    [["మాత్ర", "మాత్రలు"], ["క్యాప్సూల్", "క్యాప్సూల్స్"], ["మి.లీ.", "మి.లీ."], ["చుక్క", "చుక్కలు"], ["పఫ్", "పఫ్‌లు"], ["సాషే", "సాషేలు"], ["డోసు", "డోసులు"]],
    "సందేహం ఉంటే ఫోన్ చేయండి", "తయారు చేసిన తేదీ:", "ప్రిస్క్రిప్షన్ నుండి రాసినది. డాక్టర్ లేదా ఫార్మసిస్ట్‌తో సరిచూసుకోండి.",
  ),
  ta: L(
    "தமிழ்", "மருந்து நேர அட்டவணை",
    ["காலை", "மதியம்", "மாலை", "இரவு", "தேவைப்படும்போது மட்டும்"],
    ["சாப்பாட்டுக்கு முன்", "சாப்பாட்டுக்குப் பின்", "சாப்பாட்டுடன்", "எப்போது வேண்டுமானாலும்"],
    [["மாத்திரை", "மாத்திரைகள்"], ["கேப்ஸ்யூல்", "கேப்ஸ்யூல்கள்"], ["மி.லி.", "மி.லி."], ["சொட்டு", "சொட்டுகள்"], ["பஃப்", "பஃப்கள்"], ["சாஷே", "சாஷேகள்"], ["டோஸ்", "டோஸ்கள்"]],
    "சந்தேகம் இருந்தால் அழைக்கவும்", "தயாரித்த தேதி:", "மருந்துச் சீட்டிலிருந்து எழுதப்பட்டது. மருத்துவர் அல்லது மருந்தாளரிடம் சரிபார்க்கவும்.",
  ),
  gu: L(
    "ગુજરાતી", "દવાનું સમયપત્રક",
    ["સવાર", "બપોર", "સાંજ", "રાત", "જરૂર પડે ત્યારે જ"],
    ["જમતા પહેલાં", "જમ્યા પછી", "જમવા સાથે", "ગમે ત્યારે"],
    [["ગોળી", "ગોળીઓ"], ["કેપ્સ્યૂલ", "કેપ્સ્યૂલ"], ["મિ.લી.", "મિ.લી."], ["ટીપું", "ટીપાં"], ["પફ", "પફ"], ["સેશે", "સેશે"], ["ડોઝ", "ડોઝ"]],
    "શંકા હોય તો ફોન કરો", "બનાવ્યાની તારીખ:", "પ્રિસ્ક્રિપ્શન પરથી લખેલું છે. ડૉક્ટર અથવા ફાર્માસિસ્ટ પાસે ખાતરી કરો.",
  ),
  kn: L(
    "ಕನ್ನಡ", "ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ",
    ["ಬೆಳಿಗ್ಗೆ", "ಮಧ್ಯಾಹ್ನ", "ಸಂಜೆ", "ರಾತ್ರಿ", "ಅಗತ್ಯವಿದ್ದಾಗ ಮಾತ್ರ"],
    ["ಊಟಕ್ಕೆ ಮೊದಲು", "ಊಟದ ನಂತರ", "ಊಟದ ಜೊತೆ", "ಯಾವಾಗ ಬೇಕಾದರೂ"],
    [["ಮಾತ್ರೆ", "ಮಾತ್ರೆಗಳು"], ["ಕ್ಯಾಪ್ಸೂಲ್", "ಕ್ಯಾಪ್ಸೂಲ್‌ಗಳು"], ["ಮಿ.ಲೀ.", "ಮಿ.ಲೀ."], ["ಹನಿ", "ಹನಿಗಳು"], ["ಪಫ್", "ಪಫ್‌ಗಳು"], ["ಸ್ಯಾಶೆ", "ಸ್ಯಾಶೆಗಳು"], ["ಡೋಸ್", "ಡೋಸ್‌ಗಳು"]],
    "ಸಂದೇಹವಿದ್ದರೆ ಕರೆ ಮಾಡಿ", "ತಯಾರಿಸಿದ ದಿನಾಂಕ:", "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ನಿಂದ ಬರೆಯಲಾಗಿದೆ. ವೈದ್ಯರು ಅಥವಾ ಫಾರ್ಮಸಿಸ್ಟ್ ಬಳಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
  ),
  ml: L(
    "മലയാളം", "മരുന്ന് സമയപ്പട്ടിക",
    ["രാവിലെ", "ഉച്ചയ്ക്ക്", "വൈകുന്നേരം", "രാത്രി", "ആവശ്യമുള്ളപ്പോൾ മാത്രം"],
    ["ഭക്ഷണത്തിന് മുമ്പ്", "ഭക്ഷണത്തിന് ശേഷം", "ഭക്ഷണത്തോടൊപ്പം", "എപ്പോൾ വേണമെങ്കിലും"],
    [["ഗുളിക", "ഗുളികകൾ"], ["ക്യാപ്സ്യൂൾ", "ക്യാപ്സ്യൂളുകൾ"], ["മി.ലി.", "മി.ലി."], ["തുള്ളി", "തുള്ളികൾ"], ["പഫ്", "പഫുകൾ"], ["സാഷെ", "സാഷെകൾ"], ["ഡോസ്", "ഡോസുകൾ"]],
    "സംശയമുണ്ടെങ്കിൽ വിളിക്കുക", "തയ്യാറാക്കിയ തീയതി:", "കുറിപ്പടിയിൽ നിന്ന് പകർത്തിയത്. ഡോക്ടറോടോ ഫാർമസിസ്റ്റിനോടോ ഉറപ്പാക്കുക.",
  ),
  pa: L(
    "ਪੰਜਾਬੀ", "ਦਵਾਈ ਦੀ ਸਮਾਂ-ਸਾਰਣੀ",
    ["ਸਵੇਰੇ", "ਦੁਪਹਿਰ", "ਸ਼ਾਮ", "ਰਾਤ", "ਸਿਰਫ਼ ਲੋੜ ਪੈਣ 'ਤੇ"],
    ["ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ", "ਖਾਣੇ ਤੋਂ ਬਾਅਦ", "ਖਾਣੇ ਦੇ ਨਾਲ", "ਕਦੇ ਵੀ"],
    [["ਗੋਲੀ", "ਗੋਲੀਆਂ"], ["ਕੈਪਸੂਲ", "ਕੈਪਸੂਲ"], ["ਮਿ.ਲੀ.", "ਮਿ.ਲੀ."], ["ਬੂੰਦ", "ਬੂੰਦਾਂ"], ["ਪਫ਼", "ਪਫ਼"], ["ਸੈਸ਼ੇ", "ਸੈਸ਼ੇ"], ["ਖ਼ੁਰਾਕ", "ਖ਼ੁਰਾਕਾਂ"]],
    "ਸ਼ੱਕ ਹੋਵੇ ਤਾਂ ਫ਼ੋਨ ਕਰੋ", "ਬਣਾਉਣ ਦੀ ਤਾਰੀਖ਼:", "ਪਰਚੀ ਤੋਂ ਲਿਖਿਆ ਗਿਆ ਹੈ। ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ।",
  ),
  ur: L(
    "اردو", "دوا کا نظام الاوقات",
    ["صبح", "دوپہر", "شام", "رات", "صرف ضرورت پڑنے پر"],
    ["کھانے سے پہلے", "کھانے کے بعد", "کھانے کے ساتھ", "کسی بھی وقت"],
    [["گولی", "گولیاں"], ["کیپسول", "کیپسول"], ["ملی لیٹر", "ملی لیٹر"], ["قطرہ", "قطرے"], ["پف", "پف"], ["ساشے", "ساشے"], ["خوراک", "خوراکیں"]],
    "شک ہو تو فون کریں", "بنانے کی تاریخ:", "نسخے سے لکھا گیا ہے۔ اپنے ڈاکٹر یا فارماسسٹ سے تصدیق کریں۔",
    "rtl",
  ),
  es: L(
    "Español", "Horario de medicinas",
    ["Mañana", "Mediodía", "Tarde", "Noche", "Solo si hace falta"],
    ["Antes de comer", "Después de comer", "Con la comida", "A cualquier hora"],
    [["pastilla", "pastillas"], ["cápsula", "cápsulas"], ["ml", "ml"], ["gota", "gotas"], ["inhalación", "inhalaciones"], ["sobre", "sobres"], ["dosis", "dosis"]],
    "Si tiene dudas, llame al", "Hecho el", "Copiado de la receta. Consulte con su médico o farmacéutico.",
  ),
  fr: L(
    "Français", "Horaire des médicaments",
    ["Matin", "Après-midi", "Soir", "Nuit", "Seulement si besoin"],
    ["Avant le repas", "Après le repas", "Pendant le repas", "À tout moment"],
    [["comprimé", "comprimés"], ["gélule", "gélules"], ["ml", "ml"], ["goutte", "gouttes"], ["bouffée", "bouffées"], ["sachet", "sachets"], ["dose", "doses"]],
    "En cas de doute, appelez le", "Fait le", "Recopié de l'ordonnance. Vérifiez auprès de votre médecin ou pharmacien.",
  ),
  ar: L(
    "العربية", "جدول مواعيد الدواء",
    ["الصباح", "الظهر", "المساء", "الليل", "عند الحاجة فقط"],
    ["قبل الأكل", "بعد الأكل", "مع الأكل", "في أي وقت"],
    [["قرص", "أقراص"], ["كبسولة", "كبسولات"], ["مل", "مل"], ["قطرة", "قطرات"], ["بخة", "بخات"], ["كيس", "أكياس"], ["جرعة", "جرعات"]],
    "إذا كنت غير متأكد، اتصل على", "تاريخ الإعداد:", "منقول من الوصفة الطبية. تأكد مع طبيبك أو الصيدلي.",
    "rtl",
  ),
  zh: L(
    "中文", "服药时间表",
    ["早上", "中午", "傍晚", "晚上", "需要时才服"],
    ["饭前", "饭后", "随餐", "任何时间"],
    [["片", "片"], ["粒", "粒"], ["毫升", "毫升"], ["滴", "滴"], ["喷", "喷"], ["袋", "袋"], ["剂", "剂"]],
    "如有疑问，请致电", "制作日期：", "根据处方抄写。请向医生或药剂师确认。",
  ),
  pt: L(
    "Português", "Horário dos remédios",
    ["Manhã", "Tarde", "Fim de tarde", "Noite", "Só quando precisar"],
    ["Antes de comer", "Depois de comer", "Com a comida", "A qualquer hora"],
    [["comprimido", "comprimidos"], ["cápsula", "cápsulas"], ["ml", "ml"], ["gota", "gotas"], ["jato", "jatos"], ["sachê", "sachês"], ["dose", "doses"]],
    "Em caso de dúvida, ligue para", "Feito em", "Copiado da receita. Confirme com seu médico ou farmacêutico.",
  ),
};

const KEY: Record<LangCode, string> = {
  en: "What the pictures mean",
  hi: "चित्रों का मतलब",
  bn: "ছবিগুলোর মানে",
  mr: "चित्रांचा अर्थ",
  te: "బొమ్మల అర్థం",
  ta: "படங்களின் பொருள்",
  gu: "ચિત્રોનો અર્થ",
  kn: "ಚಿತ್ರಗಳ ಅರ್ಥ",
  ml: "ചിത്രങ്ങളുടെ അർത്ഥം",
  pa: "ਤਸਵੀਰਾਂ ਦਾ ਮਤਲਬ",
  ur: "تصویروں کا مطلب",
  es: "Qué significan los dibujos",
  fr: "Ce que veulent dire les dessins",
  ar: "معنى الصور",
  zh: "图标说明",
  pt: "O que os desenhos significam",
};
// [under the QR code, play-all button, hint on the talking card]
const LISTEN: Record<LangCode, [string, string, string]> = {
  en: ["Scan with a phone to hear this card", "Play all", "Tap a time to hear what to take"],
  hi: ["फ़ोन से स्कैन करें, कार्ड सुनें", "सब सुनें", "क्या लेना है, सुनने के लिए समय पर दबाएँ"],
  bn: ["ফোনে স্ক্যান করে কার্ডটি শুনুন", "সব শুনুন", "কী খাবেন শুনতে সময়ে চাপ দিন"],
  mr: ["फोनने स्कॅन करा, कार्ड ऐका", "सर्व ऐका", "काय घ्यायचे ते ऐकण्यासाठी वेळेवर दाबा"],
  te: ["ఫోన్‌తో స్కాన్ చేసి ఈ కార్డు వినండి", "అన్నీ వినండి", "ఏం వేసుకోవాలో వినడానికి సమయంపై నొక్కండి"],
  ta: ["போனில் ஸ்கேன் செய்து இந்த அட்டையைக் கேளுங்கள்", "அனைத்தையும் கேளுங்கள்", "என்ன சாப்பிட வேண்டும் என்று கேட்க நேரத்தைத் தொடுங்கள்"],
  gu: ["ફોનથી સ્કેન કરો, કાર્ડ સાંભળો", "બધું સાંભળો", "શું લેવું તે સાંભળવા સમય પર દબાવો"],
  kn: ["ಫೋನ್‌ನಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಕಾರ್ಡ್ ಕೇಳಿ", "ಎಲ್ಲವನ್ನೂ ಕೇಳಿ", "ಏನು ತೆಗೆದುಕೊಳ್ಳಬೇಕು ಎಂದು ಕೇಳಲು ಸಮಯದ ಮೇಲೆ ಒತ್ತಿ"],
  ml: ["ഫോണിൽ സ്കാൻ ചെയ്ത് കാർഡ് കേൾക്കൂ", "എല്ലാം കേൾക്കൂ", "എന്ത് കഴിക്കണമെന്ന് കേൾക്കാൻ സമയത്തിൽ തൊടൂ"],
  pa: ["ਫ਼ੋਨ ਨਾਲ ਸਕੈਨ ਕਰੋ, ਕਾਰਡ ਸੁਣੋ", "ਸਭ ਸੁਣੋ", "ਕੀ ਲੈਣਾ ਹੈ ਸੁਣਨ ਲਈ ਸਮੇਂ 'ਤੇ ਦਬਾਓ"],
  ur: ["فون سے اسکین کریں، کارڈ سنیں", "سب سنیں", "کیا لینا ہے سننے کے لیے وقت پر دبائیں"],
  es: ["Escanee con el móvil para escuchar esta tarjeta", "Escuchar todo", "Toque una hora para escuchar qué tomar"],
  fr: ["Scannez avec un téléphone pour écouter cette carte", "Tout écouter", "Touchez un moment pour entendre quoi prendre"],
  ar: ["امسح الرمز بالهاتف للاستماع إلى البطاقة", "استمع إلى الكل", "اضغط على الوقت لتسمع ما يجب تناوله"],
  zh: ["用手机扫码收听此卡片", "全部收听", "点按时间，收听该吃什么"],
  pt: ["Escaneie com o celular para ouvir este cartão", "Ouvir tudo", "Toque num horário para ouvir o que tomar"],
};

for (const code of Object.keys(LABELS) as LangCode[]) {
  LABELS[code].key = KEY[code];
  [LABELS[code].listen, LABELS[code].playAll, LABELS[code].tapTime] = LISTEN[code];
}

/** The picker's groups, in display order. */
export const LANGS: { group: string; codes: LangCode[] }[] = [
  { group: "", codes: ["en"] },
  { group: "Indian languages", codes: ["hi", "bn", "mr", "te", "ta", "gu", "kn", "ml", "pa", "ur"] },
  { group: "World languages", codes: ["es", "fr", "ar", "zh", "pt"] },
];

export const ENGLISH = LABELS.en;

export function labels(lang: LangCode): Labels {
  return LABELS[lang] ?? ENGLISH;
}

/** "1 tablet", "2 tablets", "½ tablet", "1½ tablets", "5 ml" */
export function amountText(l: Labels, amount: number, unit: Unit): string {
  const whole = Math.floor(amount);
  const n = amount - whole === 0.5 ? `${whole || ""}½` : String(amount);
  const [one, many] = l.units[unit];
  return `${n} ${amount <= 1 ? one : many}`;
}
