import { Card } from "../ui/card"

export default function MyAnimalCard() {
    return (
        <>
        <Card className="flex flex-row h-[100px] p-4">
            <div className="flex gap-x-5 h-full">
                <img src="https://www.guidingeyes.org/wp-content/uploads/2024/08/Slater.jpeg" className="h-[70px] w-[100px] rounded-xl object-fit" />
                <AnimalStatPill label={"animal id"} data={"A-20481"} />
                <AnimalStatPill label={"name"} data={"Billy"}/>
                <AnimalStatPill label={"age"} data={"3"}/>
                <AnimalStatPill label={"Sex"} data={"male"}/>
            </div>
        </Card>
        </>
    )
}

// reduce the sizing on the pill rows maybe allow for a larger image



function AnimalStatPill({label, data}) {
    return (
        <div className="ring-1 rounded-xl bg-gray-100 px-5 pt-1 flex flex-col justify-evenly pb-2
">
                    <span className="block text-gray-500 text-center">{label}</span>
                    <span className="block text-center">{data}</span>
                </div>
    )
}