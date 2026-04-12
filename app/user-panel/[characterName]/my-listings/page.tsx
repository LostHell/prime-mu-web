import { auth } from "@/auth";
import { getItemName } from "@/lib/item-database";
import { prisma } from "@/prisma/prisma";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import CancelListingForm from "./_components/cancel-listing-form";

interface MyListingsPageProps {
  params: Promise<{ characterName: string }>;
}

const MyListingsPage = async ({ params }: MyListingsPageProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { characterName } = await params;
  const decodedName = decodeURIComponent(characterName);
  const character = await getCharacter(session.user.id, decodedName);

  if (!character) {
    notFound();
  }

  const listings = await prisma.marketplaceListing.findMany({
    where: {
      sellerAccountId: session.user.id,
      sellerCharacter: character.name,
      status: "active",
    },
    orderBy: { listedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="section-title">My Listings</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="card-dark p-4 space-y-3">
            <div>
              <p className="font-semibold text-sm text-gold">
                {getItemName(listing.itemGroup, listing.itemIndex)} +{listing.itemLevel}
              </p>
              <p className="text-xs text-muted-foreground">Listing #{listing.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/60 px-2 py-1">
                <span className="text-muted-foreground">Price</span>
                <p className="font-semibold text-gold">{listing.price.toLocaleString()}</p>
              </div>
              <div className="rounded border border-border/60 px-2 py-1">
                <span className="text-muted-foreground">Currency</span>
                <p className="font-semibold text-gold capitalize">{listing.currencyType}</p>
              </div>
            </div>

            <CancelListingForm listingId={listing.id} characterName={character.name} />
          </div>
        ))}

        {!listings.length ? (
          <div className="card-dark p-6">
            <p className="text-sm text-muted-foreground">No active listings for this character.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyListingsPage;
