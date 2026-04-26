import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import { getLastDisconnected } from "@/lib/queries/get-last-disconnected";
import { Suspense } from "react";

const LastDisconnectedRows = async () => {
  const lastDisconnected = await getLastDisconnected();
  return (
    <TableBody>
      {lastDisconnected.map((user) => (
        <TableRow key={user.name}>
          <TableCell className="font-medium">
            {user.name}
          </TableCell>
          <TableCell>{user.map}</TableCell>
          <TableCell className="text-muted-foreground">{user.time}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const RowsSkeleton = () => (
  <TableBody>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="bg-muted h-4 w-28 animate-pulse rounded" />
        </TableCell>
        <TableCell>
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        </TableCell>
        <TableCell>
          <div className="bg-muted ml-auto h-4 w-16 animate-pulse rounded" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const LastDisconnected = () => {
  return (
    <Card>
      <CardContent>
        <Text variant="h2" className="mb-8 text-center">
          Last Disconnected Players
        </Text>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Map</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense fallback={<RowsSkeleton />}>
            <LastDisconnectedRows />
          </Suspense>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LastDisconnected;
