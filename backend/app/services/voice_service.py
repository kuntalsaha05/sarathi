import re
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class ParsedTripIntent(BaseModel):
    destination_name: str = "Jaipur"
    start_time: str = "09:00"
    max_trip_hours: float = 8.0
    avoid_crowds: bool = True
    must_see_pois: List[str] = []
    matched_poi_ids: List[str] = []
    interests: List[str] = []
    detected_language: str = "en"
    raw_query: str


POI_NAME_MAP = {
    "amber": "b1000000-0000-0000-0000-000000000001",
    "amer": "b1000000-0000-0000-0000-000000000001",
    "hawa mahal": "b1000000-0000-0000-0000-000000000002",
    "city palace": "b1000000-0000-0000-0000-000000000003",
    "jal mahal": "b1000000-0000-0000-0000-000000000004",
    "nahargarh": "b1000000-0000-0000-0000-000000000005",
    "johari bazaar": "b1000000-0000-0000-0000-000000000006",
    "shopping": "b1000000-0000-0000-0000-000000000006",
    "bazaar": "b1000000-0000-0000-0000-000000000006",
    "chokhi dhani": "b1000000-0000-0000-0000-000000000007",
    "albert hall": "b1000000-0000-0000-0000-000000000008",
    "museum": "b1000000-0000-0000-0000-000000000008",
}

POI_AUDIO_GUIDES = {
    "b1000000-0000-0000-0000-000000000001": {
        "name": "Amber Fort (आमेर किला)",
        "en": "Built in 1592 by Raja Man Singh I, Amber Fort is a majestic hill fortress overlooking Maota Lake. Famous for the Sheesh Mahal (Palace of Mirrors), where a single candle can illuminate the entire hall through thousands of concave mirrors.",
        "hi": "राजा मान सिंह प्रथम द्वारा 1592 में निर्मित आमेर किला मावठा झील के किनारे स्थित एक भव्य पहाड़ी दुर्ग है। यह अपने शीश महल के लिए दुनिया भर में प्रसिद्ध है, जहां एक मोमबत्ती का प्रकाश हजारों उत्तल दर्पणों से पूरे कक्ष को आलोकित कर देता है।",
        "best_time_to_visit": "08:30 AM or post 3:30 PM to avoid midday heat and heavy tour groups",
        "photospot": "Ganesh Pol doorway and sunset view over Maota Lake"
    },
    "b1000000-0000-0000-0000-000000000002": {
        "name": "Hawa Mahal (हवा महल)",
        "en": "Constructed in 1799 by Maharaja Sawai Pratap Singh, the 'Palace of Winds' features 953 intricately carved jharokhas (casements) designed so royal women could observe street festivals unseen from outside.",
        "hi": "1799 में महाराजा सवाई प्रताप सिंह द्वारा निर्मित 'हवा महल' में 953 बेहद नक्काशीदार झरोखे हैं। इन्हें विशेष रूप से बनाया गया था ताकि राजघराने की महिलाएं बिना बाहर दिखे सड़क पर होने वाले उत्सवों और रोजमर्रा के जीवन को देख सकें।",
        "best_time_to_visit": "09:00 AM when morning sun casts warm golden light across the pink sandstone facade",
        "photospot": "Rooftop cafes directly across the road for symmetric facade photography"
    },
    "b1000000-0000-0000-0000-000000000003": {
        "name": "City Palace (सिटी पैलेस)",
        "en": "The ceremonial seat of the Maharaja of Jaipur, City Palace blends Rajput, Mughal, and European architecture. Highlights include the Peacock Gate (Pritam Niwas Chowk) and the world's largest sterling silver vessels.",
        "hi": "जयपुर के महाराजा का औपचारिक निवास स्थान, सिटी पैलेस राजपूत, मुगल और यूरोपीय वास्तुकला का बेजोड़ संगम है। इसके प्रमुख आकर्षणों में मयूर द्वार (प्रीतम निवास चौक) और चांदी के दुनिया के सबसे बड़े दो विशाल बर्तन शामिल हैं।",
        "best_time_to_visit": "10:00 AM - 12:00 PM",
        "photospot": "Peacock Gate inner courtyard"
    },
    "b1000000-0000-0000-0000-000000000004": {
        "name": "Jal Mahal (जल महल)",
        "en": "Set serenely in the middle of Man Sagar Lake, Jal Mahal is a five-story water palace built in red sandstone, with four stories submerged underwater when the lake is full.",
        "hi": "मान सागर झील के शांत जल के बीच स्थित जल महल लाल बलुआ पत्थर से बना पांच मंजिला महल है। झील पूरी भरने पर इसकी चार मंजिलें पानी में समाई रहती हैं और सिर्फ ऊपरी मंजिल ही दिखाई देती है।",
        "best_time_to_visit": "05:00 PM - 07:00 PM (Sunset and night illumination)",
        "photospot": "Promenade lakeside during evening golden hour"
    },
    "b1000000-0000-0000-0000-000000000005": {
        "name": "Nahargarh Fort (नाहरगढ़ किला)",
        "en": "Standing atop the Aravalli hills, Nahargarh Fort provided defense to the Pink City and offers an unmatched panoramic view of Jaipur, especially breathtaking during dusk and nightfall.",
        "hi": "अरावली की पहाड़ियों की चोटी पर स्थित नाहरगढ़ किला गुलाबी नगर की रक्षा पंक्ति था। यहां से पूरे जयपुर शहर का मनोरम विहंगम दृश्य दिखाई देता है, जो विशेष रूप से सूर्यास्त और रात्रि में मनमोहक लगता है।",
        "best_time_to_visit": "04:30 PM - 07:00 PM for sunset",
        "photospot": "Padao open terrace looking down at the illuminated city grid"
    },
    "b1000000-0000-0000-0000-000000000006": {
        "name": "Johari Bazaar (जौहरी बाजार)",
        "en": "Jaipur's oldest and most vibrant gemstone and traditional jewellery market, renowned for Kundan, Meenakari, bandhej sarees, and local street delicacies like lassi and ghewar.",
        "hi": "जयपुर का सबसे प्राचीन और जीवंत रत्न व पारंपरिक आभूषण बाजार। यह कुंदन, मीनाकारी, बंधेज साड़ियों और स्वादिष्ट लस्सी व घेवर के लिए दुनिया भर में प्रसिद्ध है।",
        "best_time_to_visit": "11:00 AM - 01:30 PM or after 05:00 PM",
        "photospot": "Vibrant arcade walkways and traditional brass merchant shops"
    },
    "b1000000-0000-0000-0000-000000000007": {
        "name": "Chokhi Dhani (चोखी ढाणी)",
        "en": "An immersive ethnic Rajasthani cultural village resort showcasing traditional folk dances (Kalbeliya, Ghoomar), puppet shows, magic performances, camel rides, and authentic royal thali dining.",
        "hi": "एक सजीव पारंपरिक राजस्थानी सांस्कृतिक ग्राम जहां कालबेलिया, घूमर लोकनृत्य, कठपुतली शो, ऊंट की सवारी और शुद्ध देसी घी से बनी प्रामाणिक राजस्थानी शाही थाली का आनंद लिया जा सकता है।",
        "best_time_to_visit": "06:00 PM - 10:30 PM",
        "photospot": "Village central chaupal with folk performers and fire dancers"
    },
    "b1000000-0000-0000-0000-000000000008": {
        "name": "Albert Hall Museum (अल्बर्ट हॉल संग्रहालय)",
        "en": "The oldest museum in Rajasthan, functioning as the state museum. Designed in Indo-Saracenic style by Sir Samuel Swinton Jacob, it houses ancient coins, Persian carpets, Egyptian mummies, and arms.",
        "hi": "राजस्थान का सबसे पुराना राज्य संग्रहालय। सर सैमुअल स्विंटन जैकब द्वारा इंडो-सारैसेनिक शैली में डिज़ाइन किए गए इस संग्रहालय में प्राचीन सिक्के, फारसी कालीन, मिस्र की ममी और ऐतिहासिक अस्त्र-शस्त्र संरक्षित हैं।",
        "best_time_to_visit": "09:30 AM - 11:30 AM or during evening facade lighting",
        "photospot": "Front lawn with hundred pigeons flying against the ornate dome backdrop"
    }
}


def parse_natural_language_intent(query: str) -> ParsedTripIntent:
    """Parses natural voice transcript / text in Hindi, Hinglish, or English into structured routing inputs."""
    q_lower = query.lower()

    # Detect language hints
    hindi_keywords = ["mujhe", "jaana", "hai", "bheed", "subah", "shaam", "ghante", "ghanta", "karo", "chahiye", "किला", "महल", "जयपुर"]
    is_hindi = any(w in q_lower for w in hindi_keywords)
    lang = "hi" if is_hindi else "en"

    # Match POIs
    matched_ids = set()
    matched_names = []
    for key, poi_id in POI_NAME_MAP.items():
        if key in q_lower:
            matched_ids.add(poi_id)
            matched_names.append(key.title())

    # Detect start time
    start_time = "09:00"
    time_match = re.search(r"(\b\d{1,2})(:|\.)?(\d{2})?\s*(am|pm|baje|बजे)?", q_lower)
    if time_match:
        hour = int(time_match.group(1))
        meridiem = time_match.group(4) or ""
        if "pm" in meridiem or "shaam" in q_lower:
            if hour < 12:
                hour += 12
        elif hour < 7:  # assume afternoon if small digit without AM
            hour += 12
        start_time = f"{hour:02d}:00"

    # Detect duration
    max_trip_hours = 8.0
    hour_match = re.search(r"(\d+)\s*(hour|hr|ghante|ghanta|घंटे|घंटा)", q_lower)
    if hour_match:
        max_trip_hours = min(14.0, max(2.0, float(hour_match.group(1))))

    # Detect crowd aversion
    avoid_crowds = True
    if "ignore crowd" in q_lower or "bheed chalegi" in q_lower or "don't care about crowd" in q_lower:
        avoid_crowds = False

    # Detect interests
    interests = []
    if any(w in q_lower for w in ["heritage", "history", "fort", "palace", "itihas"]):
        interests.append("heritage")
    if any(w in q_lower for w in ["shop", "bazaar", "market", "jewel", "khareedari"]):
        interests.append("shopping")
    if any(w in q_lower for w in ["food", "dinner", "thali", "khana", "lunch", "taste"]):
        interests.append("food")
    if any(w in q_lower for w in ["photo", "sunset", "view", "camera"]):
        interests.append("viewpoint")

    return ParsedTripIntent(
        destination_name="Jaipur",
        start_time=start_time,
        max_trip_hours=max_trip_hours,
        avoid_crowds=avoid_crowds,
        must_see_pois=matched_names,
        matched_poi_ids=list(matched_ids),
        interests=interests,
        detected_language=lang,
        raw_query=query
    )


def get_poi_guide(poi_id: str, lang: str = "en") -> Optional[Dict[str, Any]]:
    guide = POI_AUDIO_GUIDES.get(poi_id)
    if not guide:
        return None
    return {
        "poi_id": poi_id,
        "name": guide["name"],
        "narration": guide.get(lang, guide["en"]),
        "best_time_to_visit": guide["best_time_to_visit"],
        "photospot": guide["photospot"]
    }

