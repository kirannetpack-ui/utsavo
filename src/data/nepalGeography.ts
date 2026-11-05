/**
 * Nepal Administrative Geography Master Data
 * Authoritative 7 Provinces, 77 Districts, Key Municipalities & Adjacent Districts
 */

export interface DistrictInfo {
  name: string;
  nepaliName: string;
  headquarters: string;
  adjacentDistricts: string[];
  majorMunicipalities: Array<{
    name: string;
    nepaliName: string;
    type: 'METROPOLITAN' | 'SUB_METROPOLITAN' | 'MUNICIPALITY' | 'RURAL_MUNICIPALITY';
    popularLocalities: string[];
  }>;
}

export interface ProvinceInfo {
  id: number;
  name: string;
  nepaliName: string;
  capital: string;
  districts: DistrictInfo[];
}

export const NEPAL_PROVINCES: ProvinceInfo[] = [
  {
    id: 1,
    name: 'Koshi Province',
    nepaliName: 'कोशी प्रदेश',
    capital: 'Biratnagar',
    districts: [
      {
        name: 'Morang',
        nepaliName: 'मोरङ',
        headquarters: 'Biratnagar',
        adjacentDistricts: ['Sunsari', 'Jhapa', 'Dhankuta', 'Ilam'],
        majorMunicipalities: [
          {
            name: 'Biratnagar Metropolitan City',
            nepaliName: 'विराटनगर महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Main Road', 'Kanchanbari', 'Tin Saini', 'Bargachhi', 'Rani'],
          },
          {
            name: 'Belbari Municipality',
            nepaliName: 'बेलबारी नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Belbari Chowk', 'Laxmimarga'],
          },
          {
            name: 'SundarHaraicha Municipality',
            nepaliName: 'सुन्दरहरैंचा नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Gothgaun', 'Salakpur', 'Biratchowk'],
          },
        ],
      },
      {
        name: 'Sunsari',
        nepaliName: 'सुनसरी',
        headquarters: 'Inaruwa',
        adjacentDistricts: ['Morang', 'Dhankuta', 'Udayapur', 'Saptari'],
        majorMunicipalities: [
          {
            name: 'Dharan Sub-Metropolitan City',
            nepaliName: 'धरान उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Bhanu Chowk', 'Bhadrapur Line', 'Chhata Chowk', 'Vijayapur'],
          },
          {
            name: 'Itahari Sub-Metropolitan City',
            nepaliName: 'इटहरी उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Main Chowk', 'Tengra Tol', 'Balgachhi', 'Sangeet Chowk'],
          },
        ],
      },
      {
        name: 'Jhapa',
        nepaliName: 'झापा',
        headquarters: 'Bhadrapur',
        adjacentDistricts: ['Morang', 'Ilam'],
        majorMunicipalities: [
          {
            name: 'Birtamod Municipality',
            nepaliName: 'बिर्तामोड नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Mukti Chowk', 'Charpane', 'Anarmani'],
          },
          {
            name: 'Damak Municipality',
            nepaliName: 'दमक नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Damak Chowk', 'Beldangi Road', 'Krishna Mandir'],
          },
        ],
      },
      { name: 'Ilam', nepaliName: 'इलाम', headquarters: 'Ilam', adjacentDistricts: ['Jhapa', 'Panchthar', 'Morang'], majorMunicipalities: [] },
      { name: 'Panchthar', nepaliName: 'पाँचथर', headquarters: 'Phidim', adjacentDistricts: ['Ilam', 'Taplejung', 'Terhathum'], majorMunicipalities: [] },
      { name: 'Taplejung', nepaliName: 'ताप्लेजुङ', headquarters: 'Phungling', adjacentDistricts: ['Panchthar', 'Sankhuwasabha'], majorMunicipalities: [] },
      { name: 'Dhankuta', nepaliName: 'धनकुटा', headquarters: 'Dhankuta', adjacentDistricts: ['Sunsari', 'Morang', 'Bhojpur', 'Terhathum'], majorMunicipalities: [] },
      { name: 'Terhathum', nepaliName: 'तेह्रथुम', headquarters: 'Myanglung', adjacentDistricts: ['Dhankuta', 'Panchthar', 'Sankhuwasabha'], majorMunicipalities: [] },
      { name: 'Sankhuwasabha', nepaliName: 'सङ्खुवासभा', headquarters: 'Khandbari', adjacentDistricts: ['Bhojpur', 'Solukhumbu', 'Taplejung'], majorMunicipalities: [] },
      { name: 'Bhojpur', nepaliName: 'भोजपुर', headquarters: 'Bhojpur', adjacentDistricts: ['Dhankuta', 'Sankhuwasabha', 'Khotang', 'Udayapur'], majorMunicipalities: [] },
      { name: 'Solukhumbu', nepaliName: 'सोलुखुम्बु', headquarters: 'Salleri', adjacentDistricts: ['Okhaldhunga', 'Khotang', 'Sankhuwasabha'], majorMunicipalities: [] },
      { name: 'Okhaldhunga', nepaliName: 'ओखलढुङ्गा', headquarters: 'Siddhicharan', adjacentDistricts: ['Solukhumbu', 'Udayapur', 'Khotang', 'Ramechhap'], majorMunicipalities: [] },
      { name: 'Khotang', nepaliName: 'खोटाङ', headquarters: 'Diktel', adjacentDistricts: ['Okhaldhunga', 'Bhojpur', 'Udayapur'], majorMunicipalities: [] },
      { name: 'Udayapur', nepaliName: 'उदयपुर', headquarters: 'Gaighat', adjacentDistricts: ['Sunsari', 'Siraha', 'Saptari', 'Okhaldhunga', 'Bhojpur'], majorMunicipalities: [] },
    ],
  },
  {
    id: 2,
    name: 'Madhesh Province',
    nepaliName: 'मधेश प्रदेश',
    capital: 'Janakpurdham',
    districts: [
      {
        name: 'Dhanusha',
        nepaliName: 'धनुषा',
        headquarters: 'Janakpurdham',
        adjacentDistricts: ['Mahottari', 'Siraha', 'Sindhuli'],
        majorMunicipalities: [
          {
            name: 'Janakpurdham Sub-Metropolitan City',
            nepaliName: 'जनकपुरधाम उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Janaki Mandir Area', 'Ramanand Chowk', 'Bhanu Chowk', 'Pidari Chowk', 'Station Road'],
          },
        ],
      },
      {
        name: 'Parsa',
        nepaliName: 'पर्सा',
        headquarters: 'Birgunj',
        adjacentDistricts: ['Bara', 'Makwanpur', 'Chitwan'],
        majorMunicipalities: [
          {
            name: 'Birgunj Metropolitan City',
            nepaliName: 'वीरगञ्ज महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Ghantaghar', 'Adarshanagar', 'Maisthan', 'Murli Chowk', 'Powerhouse Chowk'],
          },
        ],
      },
      { name: 'Bara', nepaliName: 'बारा', headquarters: 'Kalaiya', adjacentDistricts: ['Parsa', 'Rautahat', 'Makwanpur'], majorMunicipalities: [] },
      { name: 'Rautahat', nepaliName: 'रौतहट', headquarters: 'Gaur', adjacentDistricts: ['Bara', 'Sarlahi', 'Makwanpur'], majorMunicipalities: [] },
      { name: 'Sarlahi', nepaliName: 'सर्लाही', headquarters: 'Malangwa', adjacentDistricts: ['Rautahat', 'Mahottari', 'Sindhuli'], majorMunicipalities: [] },
      { name: 'Mahottari', nepaliName: 'महोत्तरी', headquarters: 'Jaleshwar', adjacentDistricts: ['Sarlahi', 'Dhanusha', 'Sindhuli'], majorMunicipalities: [] },
      { name: 'Siraha', nepaliName: 'सिराहा', headquarters: 'Siraha', adjacentDistricts: ['Dhanusha', 'Saptari', 'Udayapur'], majorMunicipalities: [] },
      { name: 'Saptari', nepaliName: 'सप्तरी', headquarters: 'Rajbiraj', adjacentDistricts: ['Siraha', 'Sunsari', 'Udayapur'], majorMunicipalities: [] },
    ],
  },
  {
    id: 3,
    name: 'Bagmati Province',
    nepaliName: 'बागमती प्रदेश',
    capital: 'Hetauda',
    districts: [
      {
        name: 'Kathmandu',
        nepaliName: 'काठमाडौँ',
        headquarters: 'Kathmandu',
        adjacentDistricts: ['Lalitpur', 'Bhaktapur', 'Nuwakot', 'Dhading', 'Sindhupalchok', 'Kavrepalanchok'],
        majorMunicipalities: [
          {
            name: 'Kathmandu Metropolitan City',
            nepaliName: 'काठमाडौँ महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Naxal', 'Baluwatar', 'Lazimpat', 'Thamel', 'New Baneshwor', 'Tinkune', 'Boudha', 'Dhumbarahi', 'Basundhara', 'Kalanki', 'Koteshwor'],
          },
          {
            name: 'Budhanilkantha Municipality',
            nepaliName: 'बुढानीलकण्ठ नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Hattigauda', 'Golfutar', 'Mandikhatar', 'Chunikhel', 'Narayanthan'],
          },
          {
            name: 'Tokha Municipality',
            nepaliName: 'टोखा नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Grande Chowk', 'Dhapasi', 'Jhor'],
          },
          {
            name: 'Kirtipur Municipality',
            nepaliName: 'कीर्तिपुर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Naya Bazaar', 'Chobhar', 'Bhatkyapati'],
          },
        ],
      },
      {
        name: 'Lalitpur',
        nepaliName: 'ललितपुर',
        headquarters: 'Patan',
        adjacentDistricts: ['Kathmandu', 'Bhaktapur', 'Kavrepalanchok', 'Makwanpur'],
        majorMunicipalities: [
          {
            name: 'Lalitpur Metropolitan City',
            nepaliName: 'ललितपुर महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Jhamsikhel', 'Pulchowk', 'Jawalakhel', 'Kupondole', 'Sanepa', 'Kumaripati', 'Satdobato', 'Balkumari', 'Dhapakhel', 'Lagankhel'],
          },
          {
            name: 'Mahalaxmi Municipality',
            nepaliName: 'महालक्ष्मी नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Imadol', 'Tikathali', 'Lubhu', 'Siddhipur'],
          },
          {
            name: 'Godawari Municipality',
            nepaliName: 'गोदावरी नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Badegaun', 'Thaiba', 'Godawari Chowk', 'Bungamati'],
          },
        ],
      },
      {
        name: 'Bhaktapur',
        nepaliName: 'भक्तपुर',
        headquarters: 'Bhaktapur',
        adjacentDistricts: ['Kathmandu', 'Lalitpur', 'Kavrepalanchok'],
        majorMunicipalities: [
          {
            name: 'Bhaktapur Municipality',
            nepaliName: 'भक्तपुर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Durbar Square', 'Byasi', 'Kamalbinayak', 'Dekocha'],
          },
          {
            name: 'Suryabinayak Municipality',
            nepaliName: 'सूर्यविनायक नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Suryabinayak Chowk', 'Pandu Bazaar', 'Gundu', 'Katunje'],
          },
          {
            name: 'Madhyapur Thimi Municipality',
            nepaliName: 'मध्यपुर थिमी नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Gatthaghar', 'Sanothimi', 'Lokanthali', 'Radhe Radhe', 'Balkumari'],
          },
        ],
      },
      {
        name: 'Chitwan',
        nepaliName: 'चितवन',
        headquarters: 'Bharatpur',
        adjacentDistricts: ['Makwanpur', 'Nawalpur', 'Dhading', 'Gorkha', 'Tanahun'],
        majorMunicipalities: [
          {
            name: 'Bharatpur Metropolitan City',
            nepaliName: 'भरतपुर महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Chaubiskothi', 'Lions Chowk', 'Bypass Road', 'Narayangarh', 'Shivanagar', 'Rampur'],
          },
          {
            name: 'Ratnanagar Municipality',
            nepaliName: 'रत्ननगर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Sauraha', 'Tandi Chowk', 'Bachauli'],
          },
        ],
      },
      {
        name: 'Makwanpur',
        nepaliName: 'मकवानपुर',
        headquarters: 'Hetauda',
        adjacentDistricts: ['Kathmandu', 'Lalitpur', 'Chitwan', 'Dhading', 'Sindhuli', 'Bara', 'Parsa'],
        majorMunicipalities: [
          {
            name: 'Hetauda Sub-Metropolitan City',
            nepaliName: 'हेटौँडा उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Seemachowk', 'Bhudhanilkantha Chowk', 'Kamana Chowk', 'Hetauda Industrial Area'],
          },
        ],
      },
      { name: 'Kavrepalanchok', nepaliName: 'काभ्रेपलाञ्चोक', headquarters: 'Dhulikhel', adjacentDistricts: ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Sindhupalchok'], majorMunicipalities: [] },
      { name: 'Dhading', nepaliName: 'धादिङ', headquarters: 'Dhading Besi', adjacentDistricts: ['Kathmandu', 'Chitwan', 'Gorkha', 'Nuwakot', 'Makwanpur'], majorMunicipalities: [] },
      { name: 'Nuwakot', nepaliName: 'नुवाकोट', headquarters: 'Bidur', adjacentDistricts: ['Kathmandu', 'Rasuwa', 'Dhading', 'Sindhupalchok'], majorMunicipalities: [] },
      { name: 'Sindhupalchok', nepaliName: 'सिन्धुपाल्चोक', headquarters: 'Chautara', adjacentDistricts: ['Kathmandu', 'Kavrepalanchok', 'Ramechhap', 'Dolakha'], majorMunicipalities: [] },
      { name: 'Dolakha', nepaliName: 'दोलखा', headquarters: 'Charikot', adjacentDistricts: ['Sindhupalchok', 'Ramechhap', 'Solukhumbu'], majorMunicipalities: [] },
      { name: 'Ramechhap', nepaliName: 'रामेछाप', headquarters: 'Manthali', adjacentDistricts: ['Dolakha', 'Sindhuli', 'Kavrepalanchok', 'Okhaldhunga'], majorMunicipalities: [] },
      { name: 'Sindhuli', nepaliName: 'सिन्धुली', headquarters: 'Kamalamai', adjacentDistricts: ['Makwanpur', 'Kavrepalanchok', 'Mahottari', 'Dhanusha', 'Sarlahi'], majorMunicipalities: [] },
      { name: 'Rasuwa', nepaliName: 'रसुवा', headquarters: 'Dhunche', adjacentDistricts: ['Nuwakot', 'Sindhupalchok', 'Dhading'], majorMunicipalities: [] },
    ],
  },
  {
    id: 4,
    name: 'Gandaki Province',
    nepaliName: 'गण्डकी प्रदेश',
    capital: 'Pokhara',
    districts: [
      {
        name: 'Kaski',
        nepaliName: 'कास्की',
        headquarters: 'Pokhara',
        adjacentDistricts: ['Tanahun', 'Syangja', 'Parbat', 'Myagdi', 'Lamjung', 'Manang'],
        majorMunicipalities: [
          {
            name: 'Pokhara Metropolitan City',
            nepaliName: 'पोखरा महानगरपालिका',
            type: 'METROPOLITAN',
            popularLocalities: ['Lakeside', 'Baidam', 'New Road', 'Chipledhunga', 'Prithvi Chowk', 'Birauta', 'Lamachaur', 'Sarangkot', 'Lekhnath'],
          },
        ],
      },
      {
        name: 'Tanahun',
        nepaliName: 'तनहुँ',
        headquarters: 'Damauli',
        adjacentDistricts: ['Kaski', 'Lamjung', 'Gorkha', 'Chitwan', 'Nawalpur', 'Syangja'],
        majorMunicipalities: [
          {
            name: 'Byas Municipality',
            nepaliName: 'व्यास नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Damauli Bazaar', 'Bhaunabhari', 'Chhabdi Barahi Road'],
          },
        ],
      },
      { name: 'Gorkha', nepaliName: 'गोरखा', headquarters: 'Gorkha', adjacentDistricts: ['Tanahun', 'Chitwan', 'Dhading', 'Lamjung', 'Manang'], majorMunicipalities: [] },
      { name: 'Lamjung', nepaliName: 'लमजुङ', headquarters: 'Besisahar', adjacentDistricts: ['Kaski', 'Tanahun', 'Gorkha', 'Manang'], majorMunicipalities: [] },
      { name: 'Syangja', nepaliName: 'स्याङ्जा', headquarters: 'Putalibazar', adjacentDistricts: ['Kaski', 'Tanahun', 'Palpa', 'Parbat'], majorMunicipalities: [] },
      { name: 'Nawalpur', nepaliName: 'नवलपुर (नवलपरासी पूर्व)', headquarters: 'Kawasoti', adjacentDistricts: ['Chitwan', 'Tanahun', 'Parasi', 'Palpa'], majorMunicipalities: [] },
      { name: 'Parbat', nepaliName: 'पर्वत', headquarters: 'Kusma', adjacentDistricts: ['Kaski', 'Syangja', 'Baglung', 'Myagdi'], majorMunicipalities: [] },
      { name: 'Baglung', nepaliName: 'बागलुङ', headquarters: 'Baglung', adjacentDistricts: ['Parbat', 'Myagdi', 'Rukum East', 'Gulmi', 'Pyuthan'], majorMunicipalities: [] },
      { name: 'Myagdi', nepaliName: 'म्याग्दी', headquarters: 'Beni', adjacentDistricts: ['Baglung', 'Parbat', 'Kaski', 'Mustang', 'Dolpa'], majorMunicipalities: [] },
      { name: 'Mustang', nepaliName: 'मुस्ताङ', headquarters: 'Jomsom', adjacentDistricts: ['Myagdi', 'Manang', 'Dolpa'], majorMunicipalities: [] },
      { name: 'Manang', nepaliName: 'मनाङ', headquarters: 'Chame', adjacentDistricts: ['Mustang', 'Kaski', 'Lamjung', 'Gorkha'], majorMunicipalities: [] },
    ],
  },
  {
    id: 5,
    name: 'Lumbini Province',
    nepaliName: 'लुम्बिनी प्रदेश',
    capital: 'Deukhuri (Rapti Valley)',
    districts: [
      {
        name: 'Rupandehi',
        nepaliName: 'रुपन्देही',
        headquarters: 'Bhairahawa',
        adjacentDistricts: ['Kapilvastu', 'Palpa', 'Nawalpur', 'Parasi'],
        majorMunicipalities: [
          {
            name: 'Butwal Sub-Metropolitan City',
            nepaliName: 'बुटवल उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Traffic Chowk', 'Milan Chowk', 'Amarpath', 'Golpark', 'Kalikanagar', 'Devinagar'],
          },
          {
            name: 'Siddharthanagar Municipality',
            nepaliName: 'सिद्धार्थनगर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Bhairahawa Bazaar', 'Airport Road', 'Bank Road'],
          },
          {
            name: 'Lumbini Sanskritik Municipality',
            nepaliName: 'लुम्बिनी सांस्कृतिक नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Maya Devi Temple Area', 'Mahilwar'],
          },
        ],
      },
      {
        name: 'Banke',
        nepaliName: 'बाँके',
        headquarters: 'Nepalgunj',
        adjacentDistricts: ['Bardiya', 'Dang', 'Salyan'],
        majorMunicipalities: [
          {
            name: 'Nepalgunj Sub-Metropolitan City',
            nepaliName: 'नेपालगञ्ज उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Dhamboji Chowk', 'Birendra Chowk', 'Surkhet Road', 'Tribhuvan Chowk'],
          },
          {
            name: 'Kohalpur Municipality',
            nepaliName: 'कोहलपुर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Kohalpur Chowk', 'Medical College Area'],
          },
        ],
      },
      {
        name: 'Dang',
        nepaliName: 'दाङ',
        headquarters: 'Ghorahi',
        adjacentDistricts: ['Banke', 'Salyan', 'Rolpa', 'Pyuthan', 'Kapilvastu'],
        majorMunicipalities: [
          {
            name: 'Ghorahi Sub-Metropolitan City',
            nepaliName: 'घोराही उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Tulsipur Chowk', 'Naya Bazaar', 'Bharatpur'],
          },
          {
            name: 'Tulsipur Sub-Metropolitan City',
            nepaliName: 'तुलसीपुर उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Birendra Chowk', 'Araniko Chowk'],
          },
        ],
      },
      { name: 'Kapilvastu', nepaliName: 'कपिलवस्तु', headquarters: 'Taulihawa', adjacentDistricts: ['Rupandehi', 'Dang', 'Arghakhanchi'], majorMunicipalities: [] },
      { name: 'Palpa', nepaliName: 'पाल्पा', headquarters: 'Tansen', adjacentDistricts: ['Rupandehi', 'Syangja', 'Tanahun', 'Gulmi', 'Nawalpur'], majorMunicipalities: [] },
      { name: 'Arghakhanchi', nepaliName: 'अर्घाखाँची', headquarters: 'Sandhikharka', adjacentDistricts: ['Kapilvastu', 'Palpa', 'Gulmi', 'Pyuthan'], majorMunicipalities: [] },
      { name: 'Gulmi', nepaliName: 'गुल्मी', headquarters: 'Tamghas', adjacentDistricts: ['Palpa', 'Arghakhanchi', 'Baglung', 'Pyuthan', 'Syangja'], majorMunicipalities: [] },
      { name: 'Bardiya', nepaliName: 'बर्दिया', headquarters: 'Gulariya', adjacentDistricts: ['Banke', 'Surkhet', 'Kailali'], majorMunicipalities: [] },
      { name: 'Pyuthan', nepaliName: 'प्युठान', headquarters: 'Pyuthan', adjacentDistricts: ['Dang', 'Rolpa', 'Arghakhanchi', 'Gulmi', 'Baglung'], majorMunicipalities: [] },
      { name: 'Rolpa', nepaliName: 'रोल्पा', headquarters: 'Liwang', adjacentDistricts: ['Dang', 'Pyuthan', 'Rukum East', 'Salyan'], majorMunicipalities: [] },
      { name: 'Rukum East', nepaliName: 'पूर्वी रुकुम', headquarters: 'Rukumkot', adjacentDistricts: ['Rolpa', 'Baglung', 'Myagdi', 'Rukum West'], majorMunicipalities: [] },
      { name: 'Parasi', nepaliName: 'परासी (नवलपरासी पश्चिम)', headquarters: 'Ramgram', adjacentDistricts: ['Rupandehi', 'Nawalpur', 'Palpa'], majorMunicipalities: [] },
    ],
  },
  {
    id: 6,
    name: 'Karnali Province',
    nepaliName: 'कर्णाली प्रदेश',
    capital: 'Birendranagar',
    districts: [
      {
        name: 'Surkhet',
        nepaliName: 'सुर्खेत',
        headquarters: 'Birendranagar',
        adjacentDistricts: ['Banke', 'Bardiya', 'Salyan', 'Dailekh', 'Jajarkot', 'Achham'],
        majorMunicipalities: [
          {
            name: 'Birendranagar Municipality',
            nepaliName: 'वीरेन्द्रनगर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Yeric Chowk', 'Mangalgadhi Chowk', 'Airport Road', 'Shubhash Chowk'],
          },
        ],
      },
      { name: 'Dailekh', nepaliName: 'दैलेख', headquarters: 'Narayan', adjacentDistricts: ['Surkhet', 'Jajarkot', 'Kalikot', 'Achham'], majorMunicipalities: [] },
      { name: 'Jajarkot', nepaliName: 'जाजरकोट', headquarters: 'Khalanga', adjacentDistricts: ['Surkhet', 'Dailekh', 'Rukum West', 'Dolpa'], majorMunicipalities: [] },
      { name: 'Salyan', nepaliName: 'सल्यान', headquarters: 'Khalanga', adjacentDistricts: ['Surkhet', 'Banke', 'Dang', 'Rolpa', 'Rukum West'], majorMunicipalities: [] },
      { name: 'Rukum West', nepaliName: 'पश्चिम रुकुम', headquarters: 'Musikot', adjacentDistricts: ['Rukum East', 'Jajarkot', 'Salyan'], majorMunicipalities: [] },
      { name: 'Jumla', nepaliName: 'जुम्ला', headquarters: 'Khalanga', adjacentDistricts: ['Kalikot', 'Mugu', 'Jajarkot'], majorMunicipalities: [] },
      { name: 'Kalikot', nepaliName: 'कालिकोट', headquarters: 'Manma', adjacentDistricts: ['Jumla', 'Dailekh', 'Achham', 'Bajura'], majorMunicipalities: [] },
      { name: 'Mugu', nepaliName: 'मुगु', headquarters: 'Gamgadhi', adjacentDistricts: ['Jumla', 'Humla', 'Dolpa'], majorMunicipalities: [] },
      { name: 'Humla', nepaliName: 'हुम्ला', headquarters: 'Simikot', adjacentDistricts: ['Mugu', 'Bajura'], majorMunicipalities: [] },
      { name: 'Dolpa', nepaliName: 'डोल्पा', headquarters: 'Dunai', adjacentDistricts: ['Jajarkot', 'Mugu', 'Mustang', 'Myagdi'], majorMunicipalities: [] },
    ],
  },
  {
    id: 7,
    name: 'Sudurpashchim Province',
    nepaliName: 'सुदूरपश्चिम प्रदेश',
    capital: 'Godawari (Kailali)',
    districts: [
      {
        name: 'Kailali',
        nepaliName: 'कैलाली',
        headquarters: 'Dhangadhi',
        adjacentDistricts: ['Kanchanpur', 'Bardiya', 'Surkhet', 'Doti', 'Dadeldhura'],
        majorMunicipalities: [
          {
            name: 'Dhangadhi Sub-Metropolitan City',
            nepaliName: 'धनगढी उपमहानगरपालिका',
            type: 'SUB_METROPOLITAN',
            popularLocalities: ['Main Chowk', 'Campus Road', 'Hasanpur', 'Chauraha', 'Boradandi'],
          },
          {
            name: 'Tikapur Municipality',
            nepaliName: 'टीकापुर नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Tikapur Park Area', 'Khaptad Chowk'],
          },
        ],
      },
      {
        name: 'Kanchanpur',
        nepaliName: 'कञ्चनपुर',
        headquarters: 'Bhimdatta',
        adjacentDistricts: ['Kailali', 'Dadeldhura'],
        majorMunicipalities: [
          {
            name: 'Bhimdatta Municipality',
            nepaliName: 'भीमदत्त नगरपालिका',
            type: 'MUNICIPALITY',
            popularLocalities: ['Mahendranagar Bazaar', 'Gadda Chowki', 'Traffic Chowk'],
          },
        ],
      },
      { name: 'Doti', nepaliName: 'डोटी', headquarters: 'Dipayal Silgadhi', adjacentDistricts: ['Kailali', 'Dadeldhura', 'Achham', 'Bajhang'], majorMunicipalities: [] },
      { name: 'Achham', nepaliName: 'अछाम', headquarters: 'Mangalsen', adjacentDistricts: ['Doti', 'Surkhet', 'Dailekh', 'Kalikot', 'Bajura'], majorMunicipalities: [] },
      { name: 'Bajhang', nepaliName: 'बझाङ', headquarters: 'Chainpur', adjacentDistricts: ['Doti', 'Baitadi', 'Bajura', 'Humla'], majorMunicipalities: [] },
      { name: 'Bajura', nepaliName: 'बाजुरा', headquarters: 'Martadi', adjacentDistricts: ['Achham', 'Kalikot', 'Humla', 'Mugu'], majorMunicipalities: [] },
      { name: 'Dadeldhura', nepaliName: 'डडेल्धुरा', headquarters: 'Amargadhi', adjacentDistricts: ['Kailali', 'Kanchanpur', 'Doti', 'Baitadi'], majorMunicipalities: [] },
      { name: 'Baitadi', nepaliName: 'बैतडी', headquarters: 'Dasharathchand', adjacentDistricts: ['Dadeldhura', 'Darchula', 'Bajhang'], majorMunicipalities: [] },
      { name: 'Darchula', nepaliName: 'दार्चुला', headquarters: 'Khalanga', adjacentDistricts: ['Baitadi', 'Bajhang'], majorMunicipalities: [] },
    ],
  },
];

/**
 * Normalizes text for resilient matching (Nepali & English, ignoring diacritics and cases)
 */
export function normalizeLocationQuery(query: string): string {
  return query.toLowerCase().trim().replace(/[\s\-_]+/g, '');
}

/**
 * Find adjacent districts when user wants to expand search
 */
export function getAdjacentDistricts(districtName: string): string[] {
  for (const province of NEPAL_PROVINCES) {
    const found = province.districts.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (found) {
      return found.adjacentDistricts || [];
    }
  }
  return [];
}
