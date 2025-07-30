import WalletConnect from "./App/WalletConnect";
import InjectiveLogo from "./InjectiveLogo";

const InjectiveWelcome = () => {
    return (
        <div>
            <div className='absolute inset-x-0 flex justify-end p-4'>
                <WalletConnect />
                {/* Fallback button for testing */}
                <button
                    onClick={() => console.log("Test button clicked")}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Test Button
                </button>
            </div>
            <main className='min-h-screen grid place-items-center'>
                <div className='flex flex-col items-center'>
                    <div className='w-[20vw] mx-auto mb-10'>
                        <InjectiveLogo />
                    </div>
                    <p className='text-4xl '>Create Injective App</p>
                    <p className='text-gray-400 my-5'>TailwindCSS + Zustand</p>
                    <a
                        target='_blank'
                        className='text-green-200 underline'
                        href='https://docs.ts.injective.network'
                    >
                        Learn how to build on top of Injective
                    </a>
                </div>
            </main>
        </div>
    );
};

export default InjectiveWelcome;