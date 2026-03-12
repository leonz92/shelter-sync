import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';

export default function DashboardCard({
  title,
  itemsArray,
  navLink,
  CardClassName,
  cardHeaderClassName,
  cardDescriptionClassName,
}) {
  const navigate = useNavigate();

  const colCount = itemsArray.length > 0 ? Object.keys(itemsArray[0]).length : 1;

  const rowMapped = itemsArray.map((item, index) => (
    <DescriptionCardRow items={item} key={index} />
  ));

  return (
    <Card className={cn('w-full', CardClassName)}>
      <CardHeader className={cn('flex justify-between items-center', cardHeaderClassName)}>
        <h2 className={cn('text-lg text-center ring-1 ring-border w-1/2 rounded-xl p-2')}>
          {title}
        </h2>
        <CardAction className={cn('min-w-[150px] rounded-xl')}>
          <Button
            className={cn(
              'text-lg text-center w-full rounded-xl h-full bg-secondary text-secondary-foreground cursor-pointer',
            )}
            onClick={() => navigate({ to: `/${navLink}` })}
          >
            Visit Page
          </Button>
        </CardAction>
      </CardHeader>
      <CardDescription
        className={cn('px-6 py-2', cardDescriptionClassName)}
        style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, minmax(auto, 1fr))` }}
      >
        {rowMapped}
      </CardDescription>
    </Card>
  );
}

function DescriptionCardRow({ items }) {
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const rowMapped = Object.keys(items).map((key) => (
    <div className="flex flex-col py-2 px-1" key={key}>
      <span className="font-bold">{capitalize(key)}</span>
      <span>{items[key]}</span>
    </div>
  ));

  return (
    <div className="contents">
      {rowMapped}
      <hr className="col-span-full border-border" />
    </div>
  );
}
