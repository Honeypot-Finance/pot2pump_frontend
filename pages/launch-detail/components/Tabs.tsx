import { cn } from "@/lib/utils";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { DiscussionArea } from "@/components/Discussion/DiscussionArea/DiscussionArea";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import BeraVoteForm from "@/components/beravote/components/NewSpace/Steps/BeraVoteForm";
import { observer } from "mobx-react-lite";
import {
  Modal,
  Tab,
  Tabs as NextUITabs,
  useDisclosure,
} from "@nextui-org/react";
import UpdateProjectModal from "./ProjectTitle";
import TransactionHistory, {
  DedicatedTransactionHistory,
} from "./TransactionHistory";
import TopHoldersTable from "./TopHoldersTable";
import { DedicatedPot2Pump } from "@/config/dedicatedPot2pump";

const universalMenuItems = [
  { key: "txs", label: "Transactions" },
  { key: "comment", label: "Comments" },
  //{ key: "priceChart", label: "Price Chart" },
];

const successMenuItems = [
  { key: "votingspace", label: "Voting Space" },
  { key: "holders", label: "Top 10 Holders" },
];

interface Transaction {
  rank: string;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

interface Holder {
  rank: string;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

const Tabs = observer(
  ({
    pair,
    refreshTrigger,
  }: {
    pair: FtoPairContract | MemePairContract | null;
    refreshTrigger?: number;
  }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const options =
      pair?.state === 0
        ? [...universalMenuItems, ...successMenuItems]
        : universalMenuItems;

    return (
      <div className="relative">
        {pair && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
              base: "max-h-[70vh] overflow-y-scroll",
            }}
          >
            <UpdateProjectModal
              pair={pair as MemePairContract}
            ></UpdateProjectModal>
          </Modal>
        )}

        <NextUITabs
          aria-label="Project Details"
          classNames={{
            base: "relative w-full",
            tabList: cn(
              "flex rounded-2xl border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020]",
              "py-1.5 sm:py-2 px-2.5 sm:px-3.5 absolute left-1/2 -translate-x-1/2 z-10 -top-5",
              "overflow-x-auto max-w-[90vw] sm:max-w-none",
              "p-1 sm:p-4"
            ),
            tab: "px-1 sm:px-2 py-1 rounded-lg whitespace-nowrap text-xs sm:text-sm sm:text-base",
            tabContent: "group-data-[selected=true]:text-white",
            cursor:
              "bg-[#020202] border border-black shadow-[0.5px_0.5px_0px_0px_#000000] sm:shadow-[2px_2px_0px_0px_#000000]",
            panel: cn(
              "flex flex-col h-full w-full gap-y-4 justify-center items-center bg-[#FFCD4D] rounded-2xl text-[#202020]",
              "px-2 sm:px-4 pt-[50px] sm:pt-[70px] pb-[50px] sm:pb-[70px]",
              "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
              "bg-[position:-65px_top,_-85px_bottom]",
              "bg-[size:auto_65px,_auto_65px]",
              "bg-repeat-x",
              "!mt-0"
            ),
          }}
        >
          <Tab
            key="comment"
            title="Comments"
          >
            {pair && (
              <DiscussionArea
                pairDatabaseId={pair.databaseId ?? -1}
                classNames={{ container: "border-none" }}
              />
            )}
          </Tab>
          <Tab
            key="txs"
            title="Transactions"
          >
            <TransactionHistory
              pairAddress={pair?.address ?? ""}
              pair={pair as MemePairContract}
              refreshTrigger={refreshTrigger}
            />
          </Tab>

          {pair?.state === 0 && (
            <>
              <Tab
                key="holders"
                title="Top 10 Holders"
              >
                <div className="w-full">
                  <h1 className="text-[var(--Heading,#0D0D0D)] text-center text-shadow-[2px_4px_0px_#AF7F3D] webkit-text-stroke-[2px] text-stroke-white font-gliker text-[32px] md:text-[64px] font-normal leading-[110%] tracking-[1.28px] mb-4 md:mb-12">
                    Top 10 Holders
                  </h1>
                  <TopHoldersTable
                    projectPool={pair as MemePairContract}
                    launchedToken={pair?.launchedToken}
                    depositedLaunchedTokenWithoutDecimals={
                      pair?.depositedLaunchedTokenWithoutDecimals || 0
                    }
                  />
                </div>
              </Tab>
              <Tab
                key="votingspace"
                title="Voting Space"
              >
                <div className="flex flex-col justify-center items-center gap-2 w-full">
                  {pair &&
                    (pair.beravoteSpaceId ? (
                      <>
                        {/* <iframe
                          className="w-full aspect-video"
                          src={`https://beravote.com/space/${pair.beravoteSpaceId}`}
                          referrerPolicy="strict-origin-when-cross-origin"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        >
                          {" "}
                        </iframe> */}
                        <Link
                          href={`https://beravote.com/space/${pair.beravoteSpaceId}`}
                        >
                          <Button className="w-full">View On Beravote</Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Image
                          src={"/images/partners/beravote.avif"}
                          width={500}
                          height={500}
                          alt="beravote logo"
                          className="w-full rounded-xl"
                        />
                        {pair.isProvider ? (
                          <BeraVoteForm pair={pair} />
                        ) : (
                          <>
                            <h3>this project does not have voting space</h3>
                            <p>
                              Please contact the project team to get a voting
                              space
                            </p>
                          </>
                        )}
                      </>
                    ))}
                </div>
              </Tab>
            </>
          )}
        </NextUITabs>
      </div>
    );
  }
);

export const DedicatedTabs = observer(
  ({ token }: { token: DedicatedPot2Pump }) => {
    return (
      <div className="relative">
        <NextUITabs
          aria-label="Project Details"
          classNames={{
            base: "relative w-full",
            tabList: cn(
              "flex rounded-2xl border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020]",
              "py-1.5 sm:py-2 px-2.5 sm:px-3.5 absolute left-1/2 -translate-x-1/2 z-10 -top-5",
              "overflow-x-auto max-w-[90vw] sm:max-w-none",
              "p-1 sm:p-4"
            ),
            tab: "px-1 sm:px-2 py-1 rounded-lg whitespace-nowrap text-xs sm:text-sm sm:text-base",
            tabContent: "group-data-[selected=true]:text-white",
            cursor:
              "bg-[#020202] border border-black shadow-[0.5px_0.5px_0px_0px_#000000] sm:shadow-[2px_2px_0px_0px_#000000]",
            panel: cn(
              "flex flex-col h-full w-full gap-y-4 justify-center items-center bg-[#FFCD4D] rounded-2xl text-[#202020]",
              "px-2 sm:px-4 pt-[50px] sm:pt-[70px] pb-[50px] sm:pb-[70px]",
              "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
              "bg-[position:-65px_top,_-85px_bottom]",
              "bg-[size:auto_65px,_auto_65px]",
              "bg-repeat-x",
              "!mt-0"
            ),
          }}
        >
          <Tab
            key="txs"
            title="Transactions"
          >
            <DedicatedTransactionHistory token={token} />
          </Tab>
        </NextUITabs>
      </div>
    );
  }
);

export default Tabs;
