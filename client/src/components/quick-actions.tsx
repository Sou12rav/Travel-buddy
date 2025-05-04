import { Hotel, Utensils, Car, Camera } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: "hotels",
      title: "Hotels",
      icon: <Hotel size={20} />,
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      id: "food",
      title: "Food",
      icon: <Utensils size={20} />,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary"
    },
    {
      id: "cabs",
      title: "Cabs",
      icon: <Car size={20} />,
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      id: "attractions",
      title: "Attractions",
      icon: <Camera size={20} />,
      bgColor: "bg-light",
      iconColor: "text-medium"
    }
  ];

  return (
    <section className="px-4 py-2">
      <h2 className="font-poppins font-semibold text-dark mb-3">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-4">
        {actions.map(action => (
          <div key={action.id} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${action.bgColor} border border-gray-200 flex items-center justify-center mb-1`}>
              <span className={action.iconColor}>{action.icon}</span>
            </div>
            <span className="text-xs text-medium text-center">{action.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
