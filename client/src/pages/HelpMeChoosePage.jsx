import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  SearchX
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HELP_ME_CHOOSE_QUESTIONS } from '../data/mockData';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';

export default function HelpMeChoosePage() {
  const { isRTL } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [recommendedProps, setRecommendedProps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (finished) {
      setLoading(true);
      fetchProperties()
        .then(properties => {
          setRecommendedProps(properties.slice(0, 3));
        })
        .catch(err => {
          console.error('Failed to load recommended properties:', err);
          setRecommendedProps([]);
        })
        .finally(() => setLoading(false));
    }
  }, [finished]);

  const handleSelectOption = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < HELP_ME_CHOOSE_QUESTIONS.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setFinished(false);
  };

  const currentQ = HELP_ME_CHOOSE_QUESTIONS[currentQuestion];

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            <Compass className="w-4 h-4 text-sky-600" />
            <span>{isRTL ? 'مستشار الشراء الذكي' : 'Smart Property Recommendation AI'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'ساعدني في اختيار أفضل عقار وموقع' : 'Help Me Choose the Perfect Property'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL 
              ? 'جاوب على 4 أسئلة سريعة عن هدفك وميزانيتك، وسيقوم المحرك باقتراح أنسب كمبوندات ومشاريع مصر.'
              : 'Answer 4 quick lifestyle & budget questions to get bespoke AI property and compound matches.'}
          </p>
        </div>

        {!finished ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-4">
              <span>{isRTL ? `السؤال ${currentQuestion + 1} من ${HELP_ME_CHOOSE_QUESTIONS.length}` : `Question ${currentQuestion + 1} of ${HELP_ME_CHOOSE_QUESTIONS.length}`}</span>
              <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-[#0B1C3D] transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / HELP_ME_CHOOSE_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0B1C3D] text-center">
              {isRTL ? currentQ.titleAr : currentQ.titleEn}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(currentQ.id, opt.value)}
                  className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] ${
                    answers[currentQ.id] === opt.value
                      ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold">{isRTL ? opt.labelAr : opt.labelEn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(curr => curr - 1)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isRTL ? 'السؤال السابق' : 'Previous Question'}</span>
              </button>
            )}

          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-[#0B1C3D]">
                {isRTL ? 'وجدنا أفضل التوصيات العقارية المناسبة لك!' : 'We Found Your Top Curated Property Matches!'}
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                {isRTL 
                  ? 'بناءً على اختياراتك، هذه أفضل العقارات التي تحقق أعلى عائد واستقرار.'
                  : 'Based on your preferences and budget, here are top recommended units in New Cairo & Sheikh Zayed.'}
              </p>

              <button
                onClick={restartQuiz}
                className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] text-xs font-bold border border-slate-200 shadow-sm"
              >
                {isRTL ? 'إعادة الاختبار' : 'Retake Quiz'}
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 font-medium text-sm">
                {isRTL ? 'جاري مطابقة العقارات المتاحة...' : 'Loading matched properties...'}
              </div>
            ) : recommendedProps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProps.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 p-8">
                <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  {isRTL ? 'لا توجد عقارات مطابقة حالياً للمعايير المحددة' : 'No properties currently match these criteria.'}
                </p>
                <p className="text-xs text-slate-500">
                  {isRTL ? 'يرجى مراجعة الخيارات أو تصفح جميع العقارات المتاحة.' : 'Try adjusting your choices or browse all active listings.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
