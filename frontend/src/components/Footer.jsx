import React from 'react';
import { Sprout, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AgriSmart AI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {language === 'te'
                ? 'భారతీయ రైతుల సంక్షేమం కోసం ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ ఆధారిత వ్యవసాయ సహాయక వేదిక. పంట సంరక్షణ, భూసారం మరియు సరైన సస్యరక్షణ సూచనలు.'
                : 'Next-generation AI agriculture assistant empowering Indian farmers with computer vision crop identification, disease detection, soil diagnostics, and ICAR-aligned guidance.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-900/60">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{language === 'te' ? 'CIB&RC మరియు ICAR మార్గదర్శకాలకు అనుగుణంగా రూపొందించబడింది' : 'Compliant with ICAR & CIB&RC Standards'}</span>
            </div>
          </div>

          {/* Useful Farmer Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'ప్రభుత్వ సేవలు' : 'Indian Agri Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://pmkisan.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://soilhealth.dac.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Soil Health Card Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://cibrc.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  CIB&RC Registered Pesticides <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://icar.org.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  ICAR Research Guidelines <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://agricoop.nic.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Dept. of Agriculture & Farmers Welfare <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Helplines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'రైతు సహాయ కేంద్రాలు' : 'Farmer Helplines'}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700">
                <p className="text-stone-400 font-medium">Kisan Call Centre (Toll Free)</p>
                <a href="tel:18001801551" className="text-emerald-400 font-bold text-base hover:underline flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-4 h-4" /> 1800-180-1551
                </a>
                <p className="text-[10px] text-stone-400 mt-1">Available 6:00 AM to 10:00 PM (22 Indian Languages)</p>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700">
                <p className="text-stone-400 font-medium">PMFBY Crop Insurance Help</p>
                <p className="text-emerald-400 font-bold text-sm">1800-200-5142</p>
              </div>
            </div>
          </div>

          {/* Safety Advisory Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'రైతులకు ముఖ్య గమనిక' : 'Safety Advisory'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed bg-stone-800/50 p-3 rounded-lg border border-stone-800">
              {language === 'te' 
                ? 'ఈ వేదిక అందించే సమాచారం కేవలం మార్గదర్శకత్వం కొరకు మాత్రమే. రసాయన మందులు పిచికారీ చేసే ముందు ఎల్లప్పుడూ లేబుల్ సూచనలను మరియు సమీప వ్యవసాయ విస్తరణ అధికారి (AEO) సలహాను పాటించండి.'
                : 'AgriSmart AI recommendations are assistive guidelines based on agronomic research. Always read container labels and confirm with local agricultural extension officers (AEO/KVK) before applying chemical inputs.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} AgriSmart AI. Dedicated to the hardworking farmers of India.</p>
          <div className="flex items-center gap-1">
            <span>Built with modern AI & care for</span>
            <span className="text-emerald-400 font-medium">Indian Agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
