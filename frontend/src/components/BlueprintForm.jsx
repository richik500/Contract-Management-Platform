import React, { useState } from 'react';
import axios from 'axios';

const BlueprintForm = ({ onBlueprintCreated }) => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([]);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const addField = (type) => {
    // Prevent duplicate fields
    if (fields.find(f => f.type === type && type !== 'Details')) {
      return alert(`A ${type} field already exists.`);
    }

    let placeholder = "Field Label";
    let inputType = "text";

    if (type === 'Text') placeholder = "e.g., Full Legal Name";
    else if (type === 'Date') {
      inputType = "date"; // Calendar picker
      placeholder = "Select Date";
    } else if (type === 'Signature') {
      placeholder = "Please enter your signature";
    } else if (type === 'Details') {
      placeholder = "Enter additional contract details";
    }

    setFields([...fields, { type, label: '', placeholder, inputType, position: { x: 0, y: 0 } }]);
  };

  const addTermsCheckbox = () => {
    if (fields.find(f => f.type === 'Checkbox')) return alert("Terms already added.");
    setFields([...fields, { 
      type: 'Checkbox', 
      label: 'I agree to the terms and conditions', 
      placeholder: 'Terms Acknowledgement', 
      inputType: 'checkbox', 
      position: { x: 0, y: 0 } 
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // VALIDATION LOGIC
    if (!name || fields.length === 0) return alert("Please provide a name and fields.");

    // REQUIREMENT: Terms & Condition must be present in the blueprint
    const termsField = fields.find(f => f.type === 'Checkbox');
    if (!termsField) {
      return alert("MANDATORY: You must add a 'Terms & Cond' field to this blueprint detail section before saving.");
    }

    // REQUIREMENT: Terms checkbox must be ticked
    if (!termsAgreed) {
      return alert("MANDATORY: You must tick the 'Terms & Conditions' checkbox to confirm agreement.");
    }

    try {
      await axios.post('http://localhost:5000/api/blueprints', { name, fields });
      setName('');
      setFields([]);
      setTermsAgreed(false);
      onBlueprintCreated();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-orange-100 mb-10 text-left">
      <h2 className="text-2xl font-black text-slate-800 mb-8">1. Create a Blueprint</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-orange-400">Blueprint Name</label>
          <input 
            type="text" 
            className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 font-bold"
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2 text-right">
          {/* UPDATED HEADER: Brackets removed as requested */}
          <label className="text-xs font-black uppercase text-orange-400 block">ADD DETAILS</label>
          <div className="flex flex-wrap gap-2 justify-end">
            <button onClick={() => addField('Text')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">+ Name</button>
            <button onClick={() => addField('Date')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">+ Date</button>
            <button onClick={() => addField('Signature')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">+ Sign</button>
            <button onClick={() => addField('Details')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">+ Details</button>
            <button onClick={addTermsCheckbox} className="bg-orange-100 text-orange-900 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-orange-200 shadow-sm transition-all">+ Terms & Cond</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-6 bg-[#fffcf9] p-6 rounded-[1.5rem] border border-orange-50 shadow-sm animate-in fade-in slide-in-from-top-4">
            <span className="text-[10px] font-black uppercase text-orange-500 min-w-[70px] tracking-widest">{field.type}</span>
            <input 
              type={field.inputType === 'date' ? 'date' : 'text'} 
              readOnly={field.type === 'Checkbox'}
              className={`flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none font-medium ${field.type === 'Checkbox' ? 'bg-orange-50/40 text-slate-500 italic' : 'focus:ring-2 focus:ring-orange-300'}`}
              value={field.label}
              placeholder={field.placeholder}
              onChange={(e) => {
                if(field.type !== 'Checkbox') {
                    const newFields = [...fields];
                    newFields[index].label = e.target.value;
                    setFields(newFields);
                }
              }} 
            />
            {field.type === 'Checkbox' && (
              <div className="flex items-center gap-3 px-4 py-2 bg-orange-100 rounded-xl border border-orange-200">
                <span className="text-[9px] font-black text-red-500 uppercase">* MANDATORY</span>
                <input 
                  type="checkbox" 
                  className="w-6 h-6 accent-orange-500 cursor-pointer"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)} 
                />
              </div>
            )}
            <button onClick={() => setFields(fields.filter((_, i) => i !== index))} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-sm">Save Blueprint</button>
    </div>
  );
};

export default BlueprintForm;