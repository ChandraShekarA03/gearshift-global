export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">GearShift Global</h1>
          <p className="text-center text-lg mb-8">Premium Automotive Parts Platform</p>
          <div className="text-center">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              Browse Parts
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}