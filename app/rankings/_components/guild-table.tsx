import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GuildRankingEntry } from "@/lib/queries/get-guild-rankings";
import { formatNumber } from "@/lib/utils/numbers";

const GuildTable = ({ guilds }: { guilds: GuildRankingEntry[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Guild</TableHead>
          <TableHead>Master</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!guilds.length && (
          <TableRow>
            <TableCell colSpan={5}>No guilds yet.</TableCell>
          </TableRow>
        )}
        {guilds.map((guild) => (
          <TableRow key={guild.name}>
            <TableCell className="text-gold">{guild.rank}</TableCell>
            <TableCell className="font-medium">{guild.name}</TableCell>
            <TableCell>{guild.master}</TableCell>
            <TableCell>{formatNumber(guild.members)}</TableCell>
            <TableCell className="text-gold">
              {formatNumber(guild.score)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GuildTable;
