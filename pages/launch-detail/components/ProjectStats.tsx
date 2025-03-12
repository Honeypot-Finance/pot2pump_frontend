import React from "react";
import { cn } from "@nextui-org/theme";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import CountdownTimer from "./Countdown";
import { observer } from "mobx-react-lite";
import { DedicatedPot2Pump } from "@/config/dedicatedPot2pump";
interface ProjectStatsProps {
  pair?: MemePairContract | null;
  className?: string;
}

interface DedicatedProjectStatsProps {
  token: DedicatedPot2Pump;
  className?: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = observer(
  ({ pair, className }) => {
    if (!pair) return null;

    if (pair.state !== 0) {
      return (
        <div
          className={cn("flex flex-col items-center gap-3 md:gap-8", className)}
        >
          {pair.state !== 0 && (
            <CountdownTimer
              endTime={pair.endTime}
              endTimeDisplay={pair.endTimeDisplay}
            />
          )}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs">
            <div className="flex flex-col items-center gap-1 md:gap-1.5">
              <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                Total Supply
              </span>
              <span className="text-sm md:text-[15px] font-bold">
                {DynamicFormatAmount({
                  amount: pair?.depositedLaunchedToken?.toFixed(18) ?? "0",
                  decimals: 2,
                  endWith: ` ${pair?.launchedToken?.symbol || ""}`,
                })}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 md:gap-1.5">
              <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                Current Raise
              </span>
              <span className="text-sm md:text-[15px] font-bold">
                {DynamicFormatAmount({
                  amount: pair?.depositedRaisedToken?.toFixed(18) ?? "0",
                  decimals: 2,
                  endWith: ` ${pair?.raiseToken?.symbol || ""}`,
                })}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 md:gap-1.5">
              <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                Participants
              </span>
              <span className="text-sm md:text-[15px] font-bold">
                {Number(pair?.participantsCount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn("flex flex-col items-center gap-3 md:gap-8", className)}
      >
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs w-full">
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Total Supply
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {DynamicFormatAmount({
                amount: pair?.depositedLaunchedToken?.toFixed(18) ?? "0",
                decimals: 2,
                endWith: ` ${pair?.launchedToken?.symbol || ""}`,
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              24H Change
            </span>
            <span
              className={cn(
                "text-sm md:text-[15px] font-bold",
                pair?.launchedToken?.priceChange24hPercentage?.startsWith("-")
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {DynamicFormatAmount({
                amount: pair?.launchedToken?.priceChange24hPercentage ?? "0",
                decimals: 2,
                endWith: "%",
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              MCap
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {DynamicFormatAmount({
                amount: Number(pair?.marketValue) || 0,
                decimals: 2,
                beginWith: "$",
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Price
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              $
              {DynamicFormatAmount({
                amount: pair?.launchedToken?.derivedUSD ?? "0",
                decimals: 3,
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Volume
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {DynamicFormatAmount({
                amount: pair?.launchedToken?.volumeUSD || 0,
                decimals: 2,
                beginWith: "$",
              })}
            </span>
          </div>
          {pair?.raisedandLaunchTokenPairPool?.totalValueLockedUSD && (
            <div className="flex flex-col items-center gap-1 md:gap-1.5">
              <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                Liquidity
              </span>
              <span className="text-sm md:text-[15px] font-bold">
                {DynamicFormatAmount({
                  amount:
                    pair?.raisedandLaunchTokenPairPool?.totalValueLockedUSD.toString() ||
                    0,
                  decimals: 2,
                  beginWith: "$",
                })}
              </span>
            </div>
          )}
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Pools
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {Number(pair?.launchedToken?.poolCount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Buys
            </span>
            <span className="text-sm md:text-[15px] font-bold text-green-500">
              {Number(pair?.launchedTokenBuyCount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Sells
            </span>
            <span className="text-sm md:text-[15px] font-bold text-red-500">
              {Number(pair?.launchedTokenSellCount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Holders
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {Number(pair?.launchedToken?.holderCount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export const DedicatedProjectStats: React.FC<DedicatedProjectStatsProps> =
  observer(({ token, className }) => {
    if (!token) return null;

    return (
      <div
        className={cn("flex flex-col items-center gap-3 md:gap-8", className)}
      >
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs w-full">
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Total Supply
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {DynamicFormatAmount({
                amount: token.token.totalSupplyWithoutDecimals
                  .div(10 ** token.token.decimals)
                  .toString(),
                decimals: 2,
                endWith: ` ${token.token.symbol || ""}`,
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              24H Change
            </span>
            <span
              className={cn(
                "text-sm md:text-[15px] font-bold",
                token.token.priceChange24hPercentage?.startsWith("-")
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {DynamicFormatAmount({
                amount: token.token.priceChange24hPercentage ?? "0",
                decimals: 2,
                endWith: "%",
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              MCap
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              {DynamicFormatAmount({
                amount: Number(token.token.marketCap) || 0,
                decimals: 2,
                beginWith: "$",
              })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
              Price
            </span>
            <span className="text-sm md:text-[15px] font-bold">
              $
              {DynamicFormatAmount({
                amount: token.token.derivedUSD ?? "0",
                decimals: 3,
              })}
            </span>
          </div>
        </div>
      </div>
    );
  });
export default ProjectStats;
