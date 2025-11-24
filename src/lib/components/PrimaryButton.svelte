<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		variant?: 'primary' | 'secondary' | 'success' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		icon?: Snippet;
		children: Snippet;
	}

	let {
		href,
		onclick,
		disabled = false,
		variant = 'primary',
		size = 'md',
		icon,
		children
	}: Props = $props();

	const variantClasses = {
		primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white',
		secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
		success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white',
		danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-lg text-white'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const baseClasses = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

{#if href}
	<a {href} class={classes}>
		{#if icon}
			{@render icon()}
		{/if}
		{@render children()}
	</a>
{:else}
	<button {onclick} {disabled} class={classes}>
		{#if icon}
			{@render icon()}
		{/if}
		{@render children()}
	</button>
{/if}
