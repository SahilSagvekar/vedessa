import { Package, Leaf, HeadphonesIcon, Globe } from 'lucide-react';

const stats = [
  { icon: Package, value: '50K+', label: 'Successful Deliveries' },
  { icon: Leaf, value: '100%', label: 'Natural Ingredients' },
  { icon: HeadphonesIcon, value: '24/7', label: 'Customer Support' },
  { icon: Globe, value: '10+', label: 'Countries Served' },
];

export default function StatsRow() {
  return (
    <section className="py-12 border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <stat.icon className="w-7 h-7 text-kama-olive" />
              <span className="text-lg font-semibold text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}