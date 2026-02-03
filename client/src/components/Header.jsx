function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
        
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          TO-DO-LIST
        </h1>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left rounded-tl-lg">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-white hover:bg-blue-50 transition">
              <td className="p-3 border-b">1</td>
              <td className="p-3 border-b"> Task 1</td>
              <td className="p-3 border-b">
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                  Active
                </span>
              </td>
              <td className="p-3 border-b space-x-2">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition">
                  Delete
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm transition">
                  Edit
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition">
                  Add
                </button>
              </td>
            </tr>

            <tr className="bg-gray-50 hover:bg-blue-50 transition">
              <td className="p-3 border-b">2</td>
              <td className="p-3 border-b"> Task 2</td>
              <td className="p-3 border-b">
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </td>
              <td className="p-3 border-b space-x-2">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                  Delete
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm">
                  Edit
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Home
