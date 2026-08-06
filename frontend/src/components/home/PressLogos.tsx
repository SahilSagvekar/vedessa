const press = ['Press 1', 'Press 2', 'Press 3', 'Press 4', 'Press 5'];

export default function PressLogos() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-serif text-center text-gray-900 mb-8">
          As Featured In
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {press.map((name) => (
            <div
              key={name}
              className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center text-center px-2"
            >
              <span className="text-[11px] text-gray-400">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}