import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState, useCallback } from "react";
import { NextLayoutPage } from "@/types/nextjs";
import { wallet } from "@/services/wallet";
import Image from "next/image";
import { chart } from "@/services/chart";
import Action, { DedicatedAction } from "./components/Action";
import Tabs, { DedicatedTabs } from "./components/Tabs";
import ProjectTitle, { ProjectTitleDedicated } from "./components/ProjectTitle";
import KlineChart from "./components/KlineChart";
import { LaunchDataProgress } from "./components/LaunchDataProgress";
import { cn } from "@/lib/tailwindcss";
import CardContainer from "@/components/CardContianer/v3";
import ProjectDescription from "./components/ProjectDescription";
import ProjectStats, { DedicatedProjectStats } from "./components/ProjectStats";
import { useLaunchTokenQuery } from "@/lib/hooks/useLaunchTokenQuery";
import { Pot2Pump } from "@/lib/algebra/graphql/generated/graphql";
import { pot2PumpToMemePair } from "@/lib/algebra/graphql/clients/pair";
import NotConnetctedDisplay from "@/components/NotConnetctedDisplay/NotConnetctedDisplay";
import { dedicatedPot2pumps } from "@/config/dedicatedPot2pump";
import { chain } from "@/services/chain";

export const DedicatedTokenView = observer(() => {
  const router = useRouter();
  const { pair: launchTokenAddress } = router.query;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const dedicatedPot2pump = dedicatedPot2pumps.find(
    (token) =>
      token.tokenAddress.toLowerCase() ===
      launchTokenAddress?.toString().toLowerCase()
  );

  useEffect(() => {
    if (!dedicatedPot2pump || !(chain.isInit || wallet.isInit)) {
      return;
    }

    dedicatedPot2pump.token
      .init(true, {
        loadIndexerTokenData: true,
        loadTotalSupply: true,
      })
      .then(() => {
        console.log(dedicatedPot2pump.token);
      });
  }, [dedicatedPot2pump, chain.isInit, wallet.isInit]);

  useEffect(() => {
    if (!dedicatedPot2pump?.token) {
      return;
    }
    chart.setCurrencyCode("USD");
    chart.setTokenNumber(0);
    chart.setChartTarget(dedicatedPot2pump.token);
    chart.setChartLabel(dedicatedPot2pump.token?.displayName + "/USD");
  }, [dedicatedPot2pump?.token]);

  return (
    <div
      className={cn(
        "w-full px-2 sm:px-4 md:px-8 xl:px-0 space-y-4 md:space-y-8 xl:max-w-[1200px] 2xl:max-w-[1500px] mx-auto"
      )}
    >
      {dedicatedPot2pump?.bannerURI && (
        <Image
          src={dedicatedPot2pump?.bannerURI ?? ""}
          alt="banner"
          width={1000}
          height={0}
          className="w-full h-auto"
        />
      )}
      <CardContainer
        type="default"
        showBottomBorder={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4 md:gap-x-4 md:gap-y-14 w-full @container">
          <div
            className={cn(
              "relative bg-white col-span-1 lg:col-span-2 px-2 sm:px-4 md:px-8 py-3 md:py-5 rounded-xl sm:rounded-3xl",
              "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 text-[#202020]"
            )}
          >
            {dedicatedPot2pump && (
              <ProjectTitleDedicated
                className="col-span-1"
                token={dedicatedPot2pump}
              />
            )}
            <ProjectDescription
              className="col-span-1"
              description={dedicatedPot2pump?.description}
            />
            {dedicatedPot2pump && (
              <DedicatedProjectStats
                className="col-span-1"
                token={dedicatedPot2pump}
              />
            )}
          </div>

          <CardContainer
            variant="dark"
            loading={!dedicatedPot2pump?.token}
            loadingSize={200}
            loadingText="Loading Data..."
            className={cn("relative min-h-[500px] px-1 sm:px-2 md:px-4")}
          >
            <div className="md:block w-full">
              <KlineChart height={500} />
            </div>
          </CardContainer>

          <div className="bg-transparent rounded-2xl space-y-3 col-span-1">
            {wallet.isInit && dedicatedPot2pump?.token ? (
              <DedicatedAction
                token={dedicatedPot2pump}
                refreshTxsCallback={triggerRefresh}
              />
            ) : (
              <NotConnetctedDisplay />
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-16 w-full">
          {dedicatedPot2pump?.token && (
            <DedicatedTabs token={dedicatedPot2pump} />
          )}
        </div>
      </CardContainer>
    </div>
  );
});

export default DedicatedTokenView;
