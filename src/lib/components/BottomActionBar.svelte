<!--
	@component
	Sticky bottom action bar with dark theme and gleam effects.
	
	## Features
	- Fixed positioning at bottom of viewport
	- Dark slate-800 background matching vertical nav
	- Border and shadow styling
	- Responsive max-width container
	- Print-hidden
	
	## Usage
	```svelte
	<BottomActionBar>
		<button>Action</button>
	</BottomActionBar>
	```
	
	## Props
	- maxWidth: Container max-width class (default: 'max-w-4xl')
	
	@example
	<BottomActionBar maxWidth="max-w-6xl">
		<a href="/back">← Back</a>
		<div class="flex-1"></div>
		<button>Save</button>
	</BottomActionBar>
-->
<script lang="ts">
	let { children, maxWidth = 'max-w-4xl' } = $props<{
		children: any;
		maxWidth?: string;
	}>();
</script>

<div class="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-lg print:hidden z-40">
	<div class="{maxWidth} mx-auto px-3 md:px-4 py-3 md:py-4">
		<div class="flex items-center gap-2">
			{@render children()}
		</div>
	</div>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-16 md:h-20 print:hidden"></div>
