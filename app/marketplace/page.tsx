import { auth } from "@/auth";
import ItemCard from "@/components/item-card";
import PageLayout from "@/components/page-layout";
import { getItemDefinition } from "@/lib/item-database";
import { prisma } from "@/prisma/prisma";
import BuyListingForm from "./_components/buy-listing-form";

type ListingView = {
  id: number;
  sellerCharacter: string;
  itemGroup: number;
  itemIndex: number;
  itemLevel: number;
  currencyType: string;
  price: number;
  listedAt: Date;
};

const MarketplacePage = async () => {
  const session = await auth();
  const accountId = session?.user?.id ?? null;

  const [listings, characters] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where: { status: "active" },
      select: {
        id: true,
        sellerCharacter: true,
        itemGroup: true,
        itemIndex: true,
        itemLevel: true,
        currencyType: true,
        price: true,
        listedAt: true,
      },
      orderBy: { listedAt: "desc" },
    }) as Promise<ListingView[]>,
    accountId
      ? prisma.character.findMany({
          where: { AccountID: accountId },
          select: { Name: true },
          orderBy: { Name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  const characterNames = characters.map((c) => c.Name);

  const enrichedListings = listings.map((listing) => {
    const def = getItemDefinition(listing.itemGroup, listing.itemIndex);
    return { ...listing, def };
  });

  return (
    <PageLayout>
      <div className="container mx-auto px-4 space-y-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse items listed by players and buy with zen or credits.
          </p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {enrichedListings.map((listing) => (
            <div key={listing.id} className="flex flex-col">
              <ItemCard
                item={{
                  slot: 0,
                  group: listing.itemGroup,
                  index: listing.itemIndex,
                  level: listing.itemLevel,
                  skill: false,
                  luck: false,
                  addOption: 0,
                  excellent: 0,
                  durability: 0,
                  rawBytes: [],
                  name: listing.def?.name ?? `Item (${listing.itemGroup}-${listing.itemIndex})`,
                  width: listing.def?.width ?? 1,
                  height: listing.def?.height ?? 1,
                  defense: listing.def?.defense,
                  defRate: listing.def?.defRate,
                  dmgMin: listing.def?.dmgMin,
                  dmgMax: listing.def?.dmgMax,
                  reqStr: listing.def?.reqStr,
                  reqAgi: listing.def?.reqAgi,
                  classFlags: listing.def?.classFlags,
                }}
              />

              <div className="card-dark p-4 space-y-3 border border-[#6b4c1e] border-t-0 rounded-t-none flex flex-col flex-1">
                <div>
                  <p className="text-xs text-muted-foreground">Seller</p>
                  <p className="text-sm font-semibold text-gold">{listing.sellerCharacter}</p>
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

                {accountId ? (
                  <BuyListingForm listingId={listing.id} characters={characterNames} />
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">Login to buy this item.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {!listings.length ? (
          <div className="card-dark p-6">
            <p className="text-sm text-muted-foreground">No active listings yet.</p>
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default MarketplacePage;
