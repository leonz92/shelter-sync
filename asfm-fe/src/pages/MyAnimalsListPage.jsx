import MyAnimalCard from "@/components/my-animals/MyAnimalCard"

export default function MyAnimalsListPage() {

    return (
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <div className="ring-2 p-5 rounded-lg bg-accent">
                <h1 className="text-center text-2xl">My Animals</h1>
            </div>
            <div className="mt-10 p-4 ring-2 rounded-lg flex flex-col gap-y-5 min-h-screen bg-accent">
                <MyAnimalCard />
                <MyAnimalCard />
            </div>
        </div>

    )
}