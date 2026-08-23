// Calculators Page with Tabs (Lectures 31-36, 55-60, 61-66)
import { useState, useMemo } from 'react';
import Tabs from '../components/common/Tabs';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import { calculateBMI, getBMICategory, calculateTDEE, calculateMacros } from '../utils/helpers';
import { validators } from '../utils/validators';
import './Calculators.css';

const tabs = [
  { id: 'bmi', label: 'BMI Calculator' },
  { id: 'tdee', label: 'TDEE Calculator' },
  { id: 'macro', label: 'Macro Calculator' },
];

const activityOptions = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
  { value: 'light', label: 'Light (1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
  { value: 'active', label: 'Active (6-7 days/week)' },
  { value: 'extreme', label: 'Extreme (2x/day)' },
];

const goalOptions = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain', label: 'Gain Muscle' },
];

const Calculators = () => {
  const [activeTab, setActiveTab] = useState('bmi');

  // BMI State
  const [bmiData, setBmiData] = useState({ weight: '', height: '' });
  const [bmiResult, setBmiResult] = useState(null);

  // TDEE State
  const [tdeeData, setTdeeData] = useState({ weight: '', height: '', age: '', gender: 'male', activity: 'moderate' });
  const [tdeeResult, setTdeeResult] = useState(null);

  // Macro State
  const [macroData, setMacroData] = useState({ calories: '', goal: 'maintain' });
  const [macroResult, setMacroResult] = useState(null);

  const handleBMI = (e) => {
    e.preventDefault();
    const w = parseFloat(bmiData.weight), h = parseFloat(bmiData.height);
    if (!w || !h) return;
    const bmi = calculateBMI(w, h);
    const cat = getBMICategory(bmi);
    setBmiResult({ value: bmi, ...cat });
  };

  const handleTDEE = (e) => {
    e.preventDefault();
    const { weight, height, age, gender, activity } = tdeeData;
    if (!weight || !height || !age) return;
    const result = calculateTDEE(parseFloat(weight), parseFloat(height), parseFloat(age), gender, activity);
    setTdeeResult(result);
  };

  const handleMacro = (e) => {
    e.preventDefault();
    const cal = parseFloat(macroData.calories);
    if (!cal) return;
    setMacroResult(calculateMacros(cal, macroData.goal));
  };

  return (
    <div className="calculators-page page-enter">
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center' }}>
          Fitness <span className="text-accent">Calculators</span>
        </h1>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-2xl)' }}>
          Data-driven tools to set accurate fitness goals.
        </p>

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* BMI Calculator */}
        {activeTab === 'bmi' && (
          <div className="calculator-card animate-fade-in">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Body Mass Index</h2>
            <form onSubmit={handleBMI}>
              <div className="calc-row">
                <FormInput id="bmi-weight" label="Weight (kg)" type="number" value={bmiData.weight} onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })} placeholder="70" />
                <FormInput id="bmi-height" label="Height (cm)" type="number" value={bmiData.height} onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })} placeholder="175" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate BMI</button>
            </form>
            {bmiResult && (
              <div className="calc-result">
                <div className="calc-result-value" style={{ color: bmiResult.color }}>{bmiResult.value}</div>
                <div className="calc-result-label">Your BMI — <strong style={{ color: bmiResult.color }}>{bmiResult.label}</strong></div>
              </div>
            )}
          </div>
        )}

        {/* TDEE Calculator */}
        {activeTab === 'tdee' && (
          <div className="calculator-card animate-fade-in">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Total Daily Energy Expenditure</h2>
            <form onSubmit={handleTDEE}>
              <div className="calc-row">
                <FormInput id="tdee-weight" label="Weight (kg)" type="number" value={tdeeData.weight} onChange={(e) => setTdeeData({ ...tdeeData, weight: e.target.value })} placeholder="70" />
                <FormInput id="tdee-height" label="Height (cm)" type="number" value={tdeeData.height} onChange={(e) => setTdeeData({ ...tdeeData, height: e.target.value })} placeholder="175" />
              </div>
              <div className="calc-row">
                <FormInput id="tdee-age" label="Age" type="number" value={tdeeData.age} onChange={(e) => setTdeeData({ ...tdeeData, age: e.target.value })} placeholder="25" />
                <FormSelect id="tdee-gender" label="Gender" value={tdeeData.gender} onChange={(e) => setTdeeData({ ...tdeeData, gender: e.target.value })} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
              </div>
              <FormSelect id="tdee-activity" label="Activity Level" value={tdeeData.activity} onChange={(e) => setTdeeData({ ...tdeeData, activity: e.target.value })} options={activityOptions} />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate TDEE</button>
            </form>
            {tdeeResult && (
              <div className="calc-result">
                <div className="calc-result-value" style={{ color: 'var(--color-accent)' }}>{tdeeResult}</div>
                <div className="calc-result-label">Calories per day to maintain weight</div>
              </div>
            )}
          </div>
        )}

        {/* Macro Calculator */}
        {activeTab === 'macro' && (
          <div className="calculator-card animate-fade-in">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Macro Split Calculator</h2>
            <form onSubmit={handleMacro}>
              <FormInput id="macro-calories" label="Daily Calories" type="number" value={macroData.calories} onChange={(e) => setMacroData({ ...macroData, calories: e.target.value })} placeholder="2000" />
              <FormSelect id="macro-goal" label="Goal" value={macroData.goal} onChange={(e) => setMacroData({ ...macroData, goal: e.target.value })} options={goalOptions} />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate Macros</button>
            </form>
            {macroResult && (
              <div className="macro-results">
                <div className="macro-card">
                  <div className="macro-value" style={{ color: 'var(--color-danger)' }}>{macroResult.protein}g</div>
                  <div className="macro-label">Protein</div>
                </div>
                <div className="macro-card">
                  <div className="macro-value" style={{ color: 'var(--color-info)' }}>{macroResult.carbs}g</div>
                  <div className="macro-label">Carbs</div>
                </div>
                <div className="macro-card">
                  <div className="macro-value" style={{ color: 'var(--color-warning)' }}>{macroResult.fat}g</div>
                  <div className="macro-label">Fat</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculators;
