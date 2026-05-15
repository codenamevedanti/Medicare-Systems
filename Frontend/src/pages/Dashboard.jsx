import { useState, useEffect } from 'react';
import { 
  Users, Stethoscope, Calendar, DollarSign, 
  AlertTriangle, Heart, Activity, Thermometer, Weight, ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // 1. Get user from storage or default to a Mock Patient for preview
  // To test Admin view, you can change 'PATIENT' to 'ADMIN' below
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { role: 'PATIENT', name: 'Ramesh Patil', id: 1 };
  });

  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    // Simulate loading data from backend
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- ADMIN MOCK DATA ---
  const adminCards = [
    { label: 'Total Patients', value: '1,240', icon: Users, color: 'blue' },
    { label: 'Doctors On Duty', value: '32', icon: Stethoscope, color: 'green' },
    { label: 'Today\'s Revenue', value: '₹45,200', icon: DollarSign, color: 'yellow' },
    { label: 'Pending Appointments', value: '18', icon: Calendar, color: 'purple' },
  ];

  // --- PATIENT MOCK DATA (Vitals) ---
  const patientCards = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Heart, color: 'red' },
    { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: Activity, color: 'orange' },
    { label: 'Body Weight', value: '72', unit: 'kg', icon: Weight, color: 'blue' },
    { label: 'Body Temp', value: '98.6', unit: '°F', icon: Thermometer, color: 'yellow' },
  ];

  const activeCards = isAdmin ? adminCards : patientCards;

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#0f4c81] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Accessing Medical Records...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            {isAdmin ? 'Hospital Command Center' : `Hello, ${user.name}`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin ? 'Real-time hospital statistics and management' : 'Your daily health vitals and medical summary'}
          </p>
        </div>
        {!isAdmin && (
          <button className="bg-[#0f4c81] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-2 w-fit">
            <Calendar size={18} /> Book Appointment
          </button>
        )}
      </div>

      {/* STATS/VITALS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {activeCards.map((card) => (
          <div key={card.label} className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${colorMap[card.color]} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800">{card.value}</span>
                {card.unit && <span className="text-gray-400 text-xs font-medium">{card.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORY TABLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-gray-700 tracking-tight">
              {isAdmin ? 'Recent Patient Registrations' : 'Recent Medical Visits'}
            </h3>
            <button className="text-xs font-bold text-[#0f4c81] flex items-center gap-1 hover:underline">
              VIEW ALL <ChevronRight size={14} />
            </button>
          </div>
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No recent records found for this period.</p>
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0f4c81] to-blue-900 rounded-3xl p-6 text-white shadow-xl">
            <h4 className="font-bold text-lg mb-2">Health Tip of the Day</h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Drinking 8 glasses of water daily helps maintain stable blood pressure and improves kidney function.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Quick Actions</h4>
            <div className="space-y-3">
              {['Download Reports', 'Contact Support', 'Emergency Help'].map((action) => (
                <button key={action} className="w-full text-left p-3 rounded-xl border border-gray-50 hover:bg-gray-50 text-sm font-semibold text-gray-600 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}