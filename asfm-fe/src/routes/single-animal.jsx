import { createFileRoute } from '@tanstack/react-router'
import SingleAnimalPage from '@/pages/singleAnimal/SingleAnimalPage'
import BasicNavBar from '@/components/basicNavBar'

export const Route = createFileRoute('/single-animal')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
    <BasicNavBar/>
    <SingleAnimalPage />
    </>
)
}
