import Navbar from '../Navbar/navbar';

function MaterialLanding() {
    return (
        <>
        <Navbar currentPage='Materials'  />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 ">
            <div className="w-full max-w-7xl mx-auto pt-20 sm:pt-24 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-1">Blog</h2>
                <h1 className="text-4xl font-bold mb-6">Articles & Materials</h1>
            </div>
        </div>
        </>
    );
}

export default MaterialLanding;