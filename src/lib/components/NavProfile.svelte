<script lang="ts">
	let { isExpanded, name = 'User Profile', email = 'user@example.com' } = $props<{
		isExpanded: boolean;
		name?: string;
		email?: string;
	}>();
</script>

<div class="border-t border-slate-700 p-4">
	<div class="flex items-center gap-4">
		<div class="h-8 w-8 rounded-full bg-slate-600 flex-shrink-0"></div>
		<div
			class="transition-all duration-300"
			class:opacity-0={!isExpanded}
			class:opacity-100={isExpanded}
			class:w-0={!isExpanded}
			class:overflow-hidden={!isExpanded}
		>
			<p class="text-sm font-medium whitespace-nowrap">{name}</p>
			<p class="text-xs text-slate-400 whitespace-nowrap">{email}</p>
		</div>
	</div>
</div>
