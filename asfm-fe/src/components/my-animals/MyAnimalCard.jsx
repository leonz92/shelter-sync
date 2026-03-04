import { Card } from '../ui/card';

export default function MyAnimalCard() {
  return (
    <>
      <Card className="flex flex-row items-center gap-4 p-4">
        <img
          src="https://www.guidingeyes.org/wp-content/uploads/2024/08/Slater.jpeg"
          className="h-16 w-16 rounded-xl object-fit flex-shrink-0"
        />
        <div className="flex flex-wrap gap-5 justify-between w-full">
          <div className="flex flex-wrap gap-5">
            <AnimalStatPill label={'animal id'} data={'A-20481'} />
            <AnimalStatPill label={'name'} data={'Billy'} />
            <AnimalStatPill label={'age'} data={'3'} />
            <AnimalStatPill label={'Sex'} data={'male'} />
            <AnimalStatPill label={'Fixed Status'} data={'male'} />
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <a className="ring-1 ring-gray-200 rounded-xl bg-gray-50 px-4 py-2 flex flex-col justify-center gap-y-0.5 w-full md:w-auto items-center">
              Read More
            </a>
          </div>
        </div>
      </Card>
    </>
  );
}

function AnimalStatPill({ label, data }) {
  return (
    <div
      className="ring-1 ring-gray-200 rounded-xl bg-gray-50 px-4 py-1 flex flex-col gap-y-0.5
"
    >
      <span className="block text-gray-500 text-center">{label}</span>
      <span className="block text-center">{data}</span>
    </div>
  );
}
