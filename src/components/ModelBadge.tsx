import { useMemo } from "react";
import { useChatStore } from "../store/chatStore";

const ModelBadge = () => {
	const activeModel = useChatStore((s) => s.activeModel);
	const displayName = useMemo(() => activeModel.split(":")[0], [activeModel]);

	return (
		<span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
			{displayName}
		</span>
	);
};

export default ModelBadge;
