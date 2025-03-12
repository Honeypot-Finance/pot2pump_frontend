import React, { createElement, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi";
import PairStatus from "@/components/atoms/TokenStatusDisplay/PairStatus";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import {
  pot2pumpShareLink,
  pot2PumpShareContent,
  dedicatedPot2PumpShareLink,
  dedicatedPot2PumpShareTwitterContent,
} from "@/config/socialSharingContents";
import { cn } from "@nextui-org/theme";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  Tooltip,
  useDisclosure,
  ModalHeader,
} from "@nextui-org/react";
import { WrappedTooltip } from "@/components/wrappedNextUI/Tooltip/Tooltip";
import { optionsPresets } from "@/components/OptionsDropdown/OptionsDropdown";
import { LucideFileEdit } from "lucide-react";
import { wallet } from "@/services/wallet";
import { toast } from "react-toastify";
import { Button } from "@/components/button/v3";
import { observer } from "mobx-react-lite";
import { WrappedToastify } from "@/lib/wrappedToastify";
import launchpad from "@/services/launchpad";
import { zodResolver } from "@hookform/resolvers/zod";
import { chain } from "@/services/chain";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Token } from "@/services/contract/token";
import { DedicatedPot2Pump } from "@/config/dedicatedPot2pump";

interface ProjectTitleProps {
  name?: string;
  displayName?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  address?: string;
  statusColor?: string;
  status?: string;
  isValidated?: boolean;
  pair?: MemePairContract;
  className?: string;
}

export const UpdateProjectModal = observer(
  ({ pair }: { pair: MemePairContract }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        z
          .object({
            projectName: z.string(),
            description: z.string(),
            twitter: z.union([
              z.string().url().startsWith("https://x.com/"),
              z.string().url().startsWith("https://twitter.com/"),
              z.literal(""),
            ]),
            website: z.string().url().startsWith("https://").or(z.literal("")),
            telegram: z.union([
              z.string().startsWith("https://t.me/"),
              z.string().startsWith("@"),
              z.literal(""),
            ]),
          })
          .transform((data) => {
            const mutateTelegram = (telegram: string | undefined | null) => {
              if (telegram && telegram.startsWith("@")) {
                return `https://t.me/${telegram.split("@")[1]}`;
              }

              return telegram;
            };
            return {
              ...data,
              telegram: mutateTelegram(data.telegram),
            };
          })
      ),
    });

    const inputBaseClass =
      "w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]";

    const labelBaseClass = "text-black text-sm md:text-base font-medium";

    const FormBody = observer(({ onClose }: any) => (
      <>
        <ModalHeader className="flex flex-col gap-1 text-black">
          Update {pair.launchedToken?.displayName}
        </ModalHeader>
        <ModalBody>
          <div className="w-full rounded-[24px] md:rounded-[32px] bg-white space-y-5 px-4 md:px-8 py-4 md:py-6 custom-dashed">
            {/* <div className="flex flex-col gap-4">
              <UploadImage
                blobName={pair.address + "_logo"}
                imagePath={
                  !!pair.logoUrl ? pair.logoUrl : "/images/project_honey.png"
                }
                onUpload={async (url) => {
                  console.log(url);
                  await launchpad.updateProjectLogo.call({
                    logo_url: url,
                    pair: pair.address,
                    chain_id: wallet.currentChainId,
                  });
                  pair.logoUrl = url;
                }}
              />
              <div className="text-black opacity-50 text-center text-sm">
                Click icon to upload new token icon
              </div>
            </div> */}
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>Project Name</label>
              <input
                type="text"
                {...register("projectName", {
                  value: pair.projectName,
                  required: "Project name is required",
                })}
                className={inputBaseClass}
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <span className="text-red-500 text-sm">
                  {errors.projectName.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>Description</label>
              <input
                type="text"
                {...register("description", {
                  value: pair.description,
                  required: "Description is required",
                })}
                className={inputBaseClass}
                placeholder="Enter description"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Twitter <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("twitter", {
                  value: pair.twitter,
                })}
                className={inputBaseClass}
                placeholder="Enter Twitter URL"
              />
              {errors.twitter && (
                <span className="text-red-500 text-sm">
                  {errors.twitter.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Website <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("website", {
                  value: pair.website,
                })}
                className={inputBaseClass}
                placeholder="Enter website URL"
              />
              {errors.website && (
                <span className="text-red-500 text-sm">
                  {errors.website.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Telegram <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("telegram", {
                  value: pair.telegram,
                })}
                className={inputBaseClass}
                placeholder="Enter Telegram URL"
              />
              {errors.telegram && (
                <span className="text-red-500 text-sm">
                  {errors.telegram.message as any}
                </span>
              )}
            </div>
            <Button
              isLoading={launchpad.updateProject.loading}
              className="bg-black text-white font-bold border-2 border-black hover:bg-black/90 w-full"
              onPress={async () => {
                handleSubmit(async (data) => {
                  await launchpad.updateProject.call({
                    pair: pair.address,
                    chain_id: chain.currentChainId,
                    projectName: data.projectName,
                    description: data.description,
                    twitter: data.twitter || "",
                    website: data.website || "",
                    telegram: data.telegram || "",
                  });
                  if (launchpad.updateProject.error) {
                    WrappedToastify.error({
                      message: "Update failed",
                      title: "Update Project Detail",
                    });
                    return;
                  }
                  await pair.getProjectInfo();
                  WrappedToastify.success({
                    message: "Update success",
                    title: "Update Project Detail",
                  });
                  onClose();
                })();
              }}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </>
    ));
    return (
      <ModalContent className="bg-[#FFCD4D]">
        {(onClose) => <FormBody onClose={onClose}></FormBody>}
      </ModalContent>
    );
  }
);

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  name,
  displayName,
  telegram,
  twitter,
  website,
  address,
  statusColor,
  status,
  isValidated,
  pair,
  className,
}) => {
  const isLoading = !pair;

  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // remind provider to edit project details
  useEffect(() => {
    if (!pair || !pair.isInit || !pair.isProvider) return;

    if (
      !pair.logoUrl ||
      !pair.projectName ||
      !pair.description ||
      !pair.twitter ||
      !pair.website ||
      !pair.telegram
    ) {
      WrappedToastify.warn({
        message: (
          <div>
            <ul className="list-disc list-inside">
              {!pair.logoUrl && <li className="text-orange-400">no icon</li>}
              {!pair.projectName && (
                <li className="text-orange-400">no project name</li>
              )}
              {!pair.description && (
                <li className="text-orange-400">no description</li>
              )}
              {!pair.twitter && (
                <li className="text-orange-400">no twitter link</li>
              )}
              {!pair.website && (
                <li className="text-orange-400">no website link</li>
              )}
              {!pair.telegram && (
                <li className="text-orange-400">no telegram link</li>
              )}
            </ul>
            <p>
              Click{" "}
              <span
                onClick={() => {
                  onOpen();
                  toast.dismiss();
                }}
                className="text-blue-500 cursor-pointer"
              >
                here
              </span>{" "}
              to update the project
            </p>
          </div>
        ),
        options: {
          autoClose: false,
        },
      });
      return () => toast.dismiss();
    }
  }, [pair, onOpen, router.query.edit, router]);

  return (
    <div
      className={cn(
        "flex items-end md:items-center md:justify-start gap-x-4 md:gap-x-[7.5px] justify-center",
        className
      )}
    >
      {pair && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            body: "bg-[#FFCD4D]",
            header: "bg-[#FFCD4D]",
            footer: "bg-[#FFCD4D]",
            closeButton: "hover:bg-black/5",
            base: "max-h-[70vh] overflow-y-auto",
          }}
        >
          <UpdateProjectModal pair={pair}></UpdateProjectModal>
        </Modal>
      )}
      <div className="flex flex-col items-center gap-2 md:gap-0 ">
        <div className="size-10 md:size-[77px] flex items-center justify-center rounded-full shrink-0">
          <Image
            width={77}
            height={77}
            objectFit="cover"
            className="rounded-full"
            sizes="(max-width: 640px) 40px,77px"
            alt={pair?.launchedToken?.name || "honey"}
            src={!!pair?.logoUrl ? pair.logoUrl : "/images/empty-logo.png"}
          />
        </div>
        <div className="flex flex-col items-center gap-0.5 md:hidden">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-[120px] bg-slate-200" />
              <Skeleton className="h-4 w-[100px] bg-slate-200" />
            </>
          ) : (
            <>
              <div className="text-base font-medium">{displayName}</div>
              {name && (
                <div className="text-xs text-[#5C5C5C]/60">({name})</div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 items-start">
        {!isLoading && (
          <div className="md:hidden">
            <PairStatus
              status={status}
              statusColor={statusColor}
              isValidated={isValidated}
            />
          </div>
        )}
        <div className="">
          <div className="hidden md:flex items-center gap-1">
            {isLoading ? (
              <Skeleton className="h-8 w-[60px] bg-slate-200" />
            ) : (
              <div className="text-2xl">{displayName}</div>
            )}
            {isLoading ? (
              <Skeleton className="h-5 w-[150px] bg-slate-200" />
            ) : name ? (
              <div className="text-sm text-[#5C5C5C]/60">({name})</div>
            ) : null}

            {pair?.isProvider && (
              <WrappedTooltip
                key={"Update Project"}
                content={"Update Project"}
              >
                <div
                  onClick={() => {
                    if (!pair) return;

                    if (
                      pair.provider.toLowerCase() !==
                      wallet.account.toLowerCase()
                    ) {
                      toast.warning("You are not the owner of this project");
                      return;
                    }

                    onOpen();
                  }}
                >
                  {
                    <div className="hover:opacity-80 text-[#5C5C5C] cursor-pointer">
                      {<LucideFileEdit size={14} />}
                    </div>
                  }
                </div>
              </WrappedTooltip>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-4 bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
                <Skeleton className="h-4 w-4 bg-slate-200" />
              </>
            ) : (
              <>
                {telegram && (
                  <WrappedTooltip content="Telegram">
                    <a
                      href={telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaTelegram size={16} />
                    </a>
                  </WrappedTooltip>
                )}
                {twitter && (
                  <WrappedTooltip content="Twitter">
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaXTwitter size={16} />
                    </a>
                  </WrappedTooltip>
                )}
                {website && (
                  <WrappedTooltip content="Website">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaGlobe size={16} />
                    </a>
                  </WrappedTooltip>
                )}

                {/*[
                optionsPresets.copy({
                  copyText: pair?.launchedToken?.address ?? "",
                  displayText: "Copy Token address",
                  copysSuccessText: "Token address copied",
                }),
                optionsPresets.share({
                  shareUrl: `${window.location.origin}/launch-detail/${pair?.launchedToken?.address}`,
                  displayText: "Share this project",
                  shareText: "Checkout this Token: " + pair?.projectName,
                }),
                optionsPresets.importTokenToWallet({
                  token: pair?.launchedToken,
                }),
                optionsPresets.viewOnExplorer({
                  address: pair?.address ?? "",
                }),
                {
                  icon: <LucideFileEdit />,
                  display: "Update Project",
                  onClick: () => {
                    if (!pair) return;

                    if (
                      pair.provider.toLowerCase() !==
                      wallet.account.toLowerCase()
                    ) {
                      toast.warning("You are not the owner of this project");
                      return;
                    }

                    onOpen();
                  },
                },
              ] */}

                {address && (
                  <>
                    <Copy
                      content="Copy address"
                      value={address}
                      displayContent={
                        <div className="relative hover:opacity-80 text-[#5C5C5C]">
                          <VscCopy size={16} />
                        </div>
                      }
                    />
                    <WrappedTooltip content="Search on Twitter">
                      <a
                        href={`https://x.com/search?q=($${displayName} or ${address})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 text-[#5C5C5C]"
                      >
                        <BiSearch size={18} />
                      </a>
                    </WrappedTooltip>

                    {[
                      optionsPresets.importTokenToWallet({
                        token: pair?.launchedToken,
                      }),
                      optionsPresets.viewOnExplorer({
                        address: pair?.address ?? "",
                      }),
                    ].map((item) => {
                      return (
                        <WrappedTooltip
                          key={item.display}
                          content={item.display}
                        >
                          <div onClick={() => item.onClick()}>
                            {
                              <div className="hover:opacity-80 text-[#5C5C5C] cursor-pointer">
                                {item.icon}
                              </div>
                            }
                          </div>
                        </WrappedTooltip>
                      );
                    })}
                  </>
                )}
                {pair?.state === 0 && (
                  <WrappedTooltip content="Defined.fi">
                    <a
                      href={`https://www.defined.fi/berachain/${pair?.launchedToken?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C] text-lg"
                      title="defined.fi"
                    >
                      {`𝔻`}
                    </a>
                  </WrappedTooltip>
                )}
                <div className="hidden md:block">
                  <PairStatus
                    status={status}
                    statusColor={statusColor}
                    isValidated={isValidated}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-start gap-1">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 bg-slate-200" />
                <Skeleton className="h-6 w-16 bg-slate-200" />
              </div>
            ) : pair ? (
              <div className="flex items-center self-start gap-2">
                <span className="text-xs sm:text-sm text-[#5C5C5C]">
                  Share To
                </span>
                <div
                  className={cn(
                    "text-right flex items-center gap-2 flex-row text-black"
                  )}
                >
                  <Link
                    className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                    target="_blank"
                    href={`https://twitter.com/intent/tweet?text=${pot2PumpShareContent(
                      pair,
                      "twitter"
                    )}%0A%0A${pot2pumpShareLink(pair)}`}
                  >
                    <div className="flex items-center gap-1 hover:text-black/40">
                      X
                      <BiLinkExternal />
                    </div>
                  </Link>
                  <Link
                    className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                    target="_blank"
                    href={`https://telegram.me/share/url?url=${pot2pumpShareLink(
                      pair
                    )}%0A&text=${pot2PumpShareContent(pair, "telegram")}`}
                  >
                    <div className="flex items-center gap-1 hover:text-black/40">
                      TG
                      <BiLinkExternal />
                    </div>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectTitleDedicated = observer(
  ({ token, className }: { token: DedicatedPot2Pump; className?: string }) => {
    return (
      <div
        className={cn(
          "flex items-end md:items-center md:justify-start gap-x-4 md:gap-x-[7.5px] justify-center",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 md:gap-0 ">
          <div className="size-10 md:size-[77px] flex items-center justify-center rounded-full shrink-0">
            <Image
              width={77}
              height={77}
              objectFit="cover"
              className="rounded-full"
              sizes="(max-width: 640px) 40px,77px"
              alt={token.token.name || "honey"}
              src={!!token.logoURI ? token.logoURI : "/images/empty-logo.png"}
            />
          </div>
          <div className="flex flex-col items-center gap-0.5 md:hidden">
            <>
              <div className="text-base font-medium">
                {token.token.displayName}
              </div>
              {token.token.name && (
                <div className="text-xs text-[#5C5C5C]/60">
                  ({token.token.name})
                </div>
              )}
            </>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start">
          <div className="">
            <div className="text-2xl">{token.token.symbol}</div>
            <div className="text-sm text-[#5C5C5C]/60">
              ({token.token.name})
            </div>
            <div className="flex items-center gap-1">
              <>
                {token.telegram && (
                  <WrappedTooltip content="Telegram">
                    <a
                      href={token.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaTelegram size={16} />
                    </a>
                  </WrappedTooltip>
                )}
                {token.twitter && (
                  <WrappedTooltip content="Twitter">
                    <a
                      href={token.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaXTwitter size={16} />
                    </a>
                  </WrappedTooltip>
                )}
                {token.website && (
                  <WrappedTooltip content="Website">
                    <a
                      href={token.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 text-[#5C5C5C]"
                    >
                      <FaGlobe size={16} />
                    </a>
                  </WrappedTooltip>
                )}

                {token.token.address && (
                  <>
                    <Copy
                      content="Copy address"
                      value={token.token.address}
                      displayContent={
                        <div className="relative hover:opacity-80 text-[#5C5C5C]">
                          <VscCopy size={16} />
                        </div>
                      }
                    />
                    <WrappedTooltip content="Search on Twitter">
                      <a
                        href={`https://x.com/search?q=($${token.token.symbol} or ${token.token.address})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 text-[#5C5C5C]"
                      >
                        <BiSearch size={18} />
                      </a>
                    </WrappedTooltip>

                    {[
                      optionsPresets.importTokenToWallet({
                        token: token.token,
                      }),
                      optionsPresets.viewOnExplorer({
                        address: token.token.address ?? "",
                      }),
                    ].map((item) => {
                      return (
                        <WrappedTooltip
                          key={item.display}
                          content={item.display}
                        >
                          <div onClick={() => item.onClick()}>
                            {
                              <div className="hover:opacity-80 text-[#5C5C5C] cursor-pointer">
                                {item.icon}
                              </div>
                            }
                          </div>
                        </WrappedTooltip>
                      );
                    })}
                  </>
                )}
                <WrappedTooltip content="Defined.fi">
                  <a
                    href={`https://www.defined.fi/berachain/${token.token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 text-[#5C5C5C] text-lg"
                    title="defined.fi"
                  >
                    {`𝔻`}
                  </a>
                </WrappedTooltip>
              </>
            </div>
            <div className="flex items-start gap-1">
              {
                <div className="flex items-center self-start gap-2">
                  <span className="text-xs sm:text-sm text-[#5C5C5C]">
                    Share To
                  </span>
                  <div
                    className={cn(
                      "text-right flex items-center gap-2 flex-row text-black"
                    )}
                  >
                    <Link
                      className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                      target="_blank"
                      href={`https://twitter.com/intent/tweet?text=${dedicatedPot2PumpShareTwitterContent(
                        token
                      )}%0A%0A${dedicatedPot2PumpShareLink(token)}`}
                    >
                      <div className="flex items-center gap-1 hover:text-black/40">
                        X
                        <BiLinkExternal />
                      </div>
                    </Link>
                    <Link
                      className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                      target="_blank"
                      href={`https://telegram.me/share/url?url=${dedicatedPot2PumpShareLink(
                        token
                      )}%0A&text=${dedicatedPot2PumpShareTwitterContent(token)}`}
                    >
                      <div className="flex items-center gap-1 hover:text-black/40">
                        TG
                        <BiLinkExternal />
                      </div>
                    </Link>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ProjectTitle;
