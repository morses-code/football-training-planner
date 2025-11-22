<!--
	@component
	Action button for bottom action bar with gleam effect on click.
	
	## Features
	- Click-triggered gleam animation
	- Consistent styling (slate-300 text, hover to white)
	- Optional icon support
	- Disabled state support
	- Can be link or button
	
	## Usage
	```svelte
	<ActionButton href="/back" gleamId="back" {gleamingItem} {triggerGleam}>
		← Back
	</ActionButton>
	```
	
	## Props
	- href: Optional link destination (renders as <a>)
	- type: Button type when not a link (default: 'button')
	- disabled: Disable button state
	- gleamId: Unique ID for this button's gleam effect
	- gleamingItem: Current gleaming item ID from parent state
	- triggerGleam: Function to trigger gleam effect
	- variant: Color variant ('default' | 'danger')
	- onclick: Click handler function
	
	@example
	<ActionButton 
		gleamId="save" 
		{gleamingItem} 
		{triggerGleam}
		type="submit"
	>
		Save Changes
	</ActionButton>
-->
<script lang="ts">
	let {
		children,
		href,
		type = 'button',
		disabled = false,
		gleamId,
		gleamingItem = $bindable(),
		triggerGleam,
		variant = 'default',
		onclick
	} = $props<{
		children: any;
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		gleamId: string;
		gleamingItem: string | null;
		triggerGleam: (id: string) => void;
		variant?: 'default' | 'danger';
		onclick?: (e: MouseEvent) => void;
	}>();

	const baseClasses =
		'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium relative overflow-hidden';
	const variantClasses: Record<string, string> = {
		default: 'text-slate-300 hover:text-white hover:bg-slate-700',
		danger: 'text-red-400 hover:text-red-300 hover:bg-slate-700'
	};
	const disabledClass = 'disabled:opacity-50';

	function handleClick(e: MouseEvent) {
		triggerGleam(gleamId);
		if (onclick) onclick(e);
	}
</script>

{#if href}
	<a
		{href}
		onclick={handleClick}
		class="{baseClasses} {variantClasses[variant]}"
	>
		{#if gleamingItem === gleamId}
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
		{/if}
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		onclick={handleClick}
		class="{baseClasses} {variantClasses[variant]} {disabledClass}"
	>
		{#if gleamingItem === gleamId}
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
		{/if}
		{@render children()}
	</button>
{/if}
