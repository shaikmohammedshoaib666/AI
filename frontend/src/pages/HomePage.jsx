import React from 'react';
import { 
  Sprout, 
  ScanLine, 
  Activity, 
  FlaskConical, 
  Pill, 
  MessageSquareText, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sun, 
  CheckCircle, 
  Smartphone,
  Sparkles,
  Leaf
} from 'lucide-react';

export default function HomePage({ setActivePage, language }) {
  const isTe = language === 'te';

  const features = [
    {
      id: 'crop-id',
      icon: ScanLine,
      title: isTe ? 'ఏఐ పంట గుర్తింపు' : 'AI Crop Identification',
      desc: isTe
        ? 'పంట లేదా మొక్క ఫోటో తీసి అప్‌లోడ్ చేయండి. ఖచ్చితమైన పంట రకం, అనుకూల వాతావరణం, పంట కాలాన్ని క్షణాల్లో తెలుసుకోండి.'
        : 'Snap a photo to accurately identify crop species, ideal agro-climatic conditions, growth cycles, and soil requirements.',
      color: 'from-emerald-500 to-green-600',
      badge: 'MobileNetV2'
    },
    {
      id: 'disease-detect',
      icon: Activity,
      title: isTe ? 'ఆకు తెగుళ్ళ నిర్ధారణ' : 'Leaf Disease Detection',
      desc: isTe
        ? 'ఆకులపై మచ్చలు లేదా తెగుళ్ళ లక్షణాలను గుర్తించండి. తెగులు పేరు, కారణాలు, సేంద్రీయ మరియు రసాయన నివారణ చర్యలను పొందండి.'
        : 'Deep learning detects early blight, rust, leaf curl, and blast with symptoms, causes, organic bio-control, and CIBRC chemical remedies.',
      color: 'from-amber-500 to-red-600',
      badge: 'PlantVillage Deep CNN'
    },
    {
      id: 'soil-analysis',
      icon: FlaskConical,
      title: isTe ? 'భూసార & పోషకాల పరీక్ష' : 'Soil Health & Nutrients',
      desc: isTe
        ? 'నత్రజని (N), భాస్వరం (P), పొటాష్ (K), pH విలువలను నమోదు చేసి భూసార ఇండెక్స్ మరియు యూరియా, DAP సిఫార్సులను పొందండి.'
        : 'Evaluate N-P-K levels, pH acidity/alkalinity, and moisture. Get ICAR-aligned fertilizer dosages (Urea, DAP, MOP, Gypsum).',
      color: 'from-earth-600 to-amber-700',
      badge: 'ICAR Benchmarks'
    },
    {
      id: 'recommendations',
      icon: Pill,
      title: isTe ? 'పురుగు మందుల సూచిక' : 'Pesticide & Fertilizer Advisory',
      desc: isTe
        ? 'భారత ప్రభుత్వ CIB&RC అనుమతించిన మందులు, పిచికారీ మోతాదు (15 లీటర్ల పంపుకు), రక్షణ జాగ్రత్తలు మరియు వేచి ఉండే కాలం (PHI).'
        : 'Authentic Indian CIBRC registered active ingredients, dilution per 15L knapsack sprayer, safety PPE, and Pre-Harvest Intervals.',
      color: 'from-teal-600 to-cyan-700',
      badge: 'CIB&RC Registered'
    },
    {
      id: 'assistant',
      icon: MessageSquareText,
      title: isTe ? 'రైతు ఏఐ మిత్రుడు' : 'Bilingual AI Farmer Assistant',
      desc: isTe
        ? 'తెలుగు లేదా ఇంగ్లీషులో మీ వ్యవసాయ ప్రశ్నలు అడగండి: ఆకులు ఎందుకు పసుపుగా మారుతున్నాయి? ఏ ఎరువు వాడాలి? నీరు ఎప్పుడు పెట్టాలి?'
        : 'Ask your farming questions in English or Telugu (తెలుగు): yellowing leaves, fertilizer schedules, irrigation timing, and pest control.',
      color: 'from-indigo-600 to-blue-700',
      badge: 'English & తెలుగు'
    },
    {
      id: 'my-farm',
      icon: MapPin,
      title: isTe ? 'నా పొలం & ప్రత్యక్ష వాతావరణం' : 'My Farm & Agro-Weather',
      desc: isTe
        ? 'మీ గ్రామం/జిల్లాను మ్యాప్‌పై గుర్తించండి. లైవ్ వాతావరణం, వర్షపాత అంచనా మరియు పిచికారీకి అనుకూల సమయ హెచ్చరికలను పొందండి.'
        : 'Interactive Leaflet farm mapping, live Open-Meteo weather forecasts, spray window alerts, and saved diagnostic history.',
      color: 'from-emerald-700 to-teal-800',
      badge: 'OpenStreetMap & Live API'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-950 via-agri-900 to-earth-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-agri-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-agri-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-earth-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTe ? 'భారతీయ రైతుల కోసం రూపొందించిన స్మార్ట్ వ్యవసాయ వేదిక' : 'Modern AI Platform for Indian Farmers'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {isTe ? (
              <>
                స్మార్ట్ వ్యవసాయంతో <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-amber-200">
                  అధిక దిగుబడి & లాభాలు
                </span>
              </>
            ) : (
              <>
                Smarter Farming, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-amber-200">
                  Healthier Crops & Bumper Yields
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            {isTe
              ? 'అగ్రిస్మార్ట్ ఏఐ ద్వారా మీ పంట ఆకుల ఫోటోలు తీసి తెగుళ్ళను గుర్తించండి, నేల పోషకాలను పరీక్షించి సరైన ఎరువుల మోతాదును తెలుసుకోండి, మరియు తెలుగులో వ్యక్తిగతీకరించిన వ్యవసాయ సలహాలను పొందండి.'
              : 'Identify crops and plant diseases instantly with deep learning vision models, analyze soil nutrient balance with ICAR benchmarks, check spray weather windows, and consult your bilingual AI agricultural assistant.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-agri-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center gap-2 group"
            >
              <span>{isTe ? 'డ్యాష్‌బోర్డ్ ప్రారంభించండి' : 'Open Farmer Dashboard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('disease-detect')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>{isTe ? 'తెగుళ్ళ నిర్ధారణ స్కాన్' : 'Scan Leaf Disease'}</span>
            </button>

            <button
              onClick={() => setActivePage('assistant')}
              className="px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-sm backdrop-blur-md border border-amber-400/30 transition-all flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4 text-amber-300" />
              <span>{isTe ? 'రైతు సలహాదారు (తెలుగు)' : 'Ask AI Assistant'}</span>
            </button>
          </div>

          {/* Key Value Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs text-emerald-100/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTe ? 'ఖచ్చితమైన AI మోడల్స్' : 'Real Vision Inference'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTe ? 'ICAR & CIBRC మార్గదర్శకాలు' : 'ICAR & CIBRC Aligned'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTe ? 'తెలుగు మరియు ఇంగ్లీష్' : 'Telugu & English Support'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-agri-700 tracking-wider uppercase bg-agri-100 px-3 py-1 rounded-full">
            {isTe ? 'ప్రధాన విభాగాలు' : 'Comprehensive Agricultural Toolkit'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {isTe ? 'రైతులకు అవసరమైన అన్ని ఆధునిక సేవలు' : 'Everything a Modern Farmer Needs'}
          </h2>
          <p className="text-stone-600 text-sm">
            {isTe
              ? 'సాంకేతిక పరిజ్ఞానం లేని రైతులకు కూడా సులభంగా అర్థమయ్యే రీతిలో రూపొందించబడిన ప్రత్యేక సాధనాలు.'
              : 'Designed with large buttons, intuitive cards, and localized agronomic intelligence.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActivePage(feat.id)}
                className="group bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-agri-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-agri-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-agri-700 group-hover:text-agri-800">
                  <span>{isTe ? 'విభాగాన్ని చూడండి' : 'Open Tool'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works / 3-Step Process */}
      <section className="bg-stone-100/80 rounded-3xl p-8 sm:p-12 border border-stone-200">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {isTe ? 'అగ్రిస్మార్ట్ ఏఐ ఎలా పనిచేస్తుంది?' : 'How AgriSmart AI Works in 3 Simple Steps'}
          </h2>
          <p className="text-sm text-stone-600">
            {isTe
              ? 'స్మార్ట్‌ఫోన్ ద్వారా నిమిషాల్లో సమస్య నిర్ధారణ మరియు సరైన నివారణ'
              : 'Direct from field to actionable prescription in seconds'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-stone-900 text-base">{isTe ? 'ఫోటో తీయండి' : '1. Snap or Upload'}</h4>
            <p className="text-xs text-stone-600">
              {isTe
                ? 'మీ పంట ఆకు లేదా నేల ఫోటోను మొబైల్ కెమెరాతో తీసి అప్‌లోడ్ చేయండి.'
                : 'Take a close-up photo of the affected leaf or enter soil test numbers.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-stone-900 text-base">{isTe ? 'ఏఐ విశ్లేషణ' : '2. Instant AI Diagnosis'}</h4>
            <p className="text-xs text-stone-600">
              {isTe
                ? 'డీప్ లెర్నింగ్ మోడల్ తెగులు లక్షణాలను మరియు తీవ్రత శాతాన్ని లెక్కగడుతుంది.'
                : 'Computer vision identifies disease pathogen, symptoms, and severity confidence.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-stone-900 text-base">{isTe ? 'సరైన మందులు వాడండి' : '3. Apply Safe Treatment'}</h4>
            <p className="text-xs text-stone-600">
              {isTe
                ? 'CIB&RC అనుమతించిన మందుల మోతాదు, సేంద్రీయ పరిష్కారం మరియు భద్రతా సూచనలు పాటించండి.'
                : 'Apply registered CIBRC active ingredients with exact 15L sprayer dilutions and organic measures.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
