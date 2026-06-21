import { CHANNELS, type Channel } from "../../lib/videoMockData";
import ChannelCard from "./ChannelCard";

interface ChannelsSectionProps {
  activeChannel: string | undefined;
  onSelectChannel: (name: string | undefined) => void;
}

function Rail({
  title,
  subtitle,
  flag,
  channels,
  activeChannel,
  onSelect,
}: {
  title: string;
  subtitle: string;
  flag: string;
  channels: Channel[];
  activeChannel: string | undefined;
  onSelect: (n: string | undefined) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>{flag}</span>
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {activeChannel && channels.some((c) => c.name === activeChannel) && (
          <button
            onClick={() => onSelect(undefined)}
            className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline"
          >
            Show all
          </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x snap-mandatory scrollbar-thin">
        {channels.map((c, i) => (
          <div key={c.name} className="snap-start shrink-0 w-[220px] sm:w-[240px]">
            <ChannelCard
              channel={c}
              onClick={() => onSelect(activeChannel === c.name ? undefined : c.name)}
              isActive={activeChannel === c.name}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ChannelsSection({ activeChannel, onSelectChannel }: ChannelsSectionProps) {
  const indian = CHANNELS.filter((c) => c.region === "in");
  const international = CHANNELS.filter((c) => c.region === "intl");

  return (
    <div className="space-y-8">
      <Rail
        title="Top Indian Educators"
        subtitle="Learn in Hindi & Hinglish from India's best teachers"
        flag="🇮🇳"
        channels={indian}
        activeChannel={activeChannel}
        onSelect={onSelectChannel}
      />
      <Rail
        title="International Creators"
        subtitle="World-class courses in English"
        flag="🌍"
        channels={international}
        activeChannel={activeChannel}
        onSelect={onSelectChannel}
      />
    </div>
  );
}
