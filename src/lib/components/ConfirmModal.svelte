<script lang="ts">
	let { 
		isOpen = $bindable(false),
		title,
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		onConfirm,
		onCancel,
		danger = false
	} = $props<{
		isOpen: boolean;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
		onCancel?: () => void;
		danger?: boolean;
	}>();

	function handleConfirm() {
		onConfirm();
		isOpen = false;
	}

	function handleCancel() {
		if (onCancel) {
			onCancel();
		}
		isOpen = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}
</script>

{#if isOpen}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
			<!-- Header -->
			<div class="px-6 py-5 border-b border-slate-200">
				<h3 class="text-xl font-bold text-slate-900">{title}</h3>
			</div>

			<!-- Body -->
			<div class="px-6 py-5">
				<p class="text-slate-600">{message}</p>
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
				<button
					onclick={handleCancel}
					class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-colors text-sm font-semibold border border-slate-300 shadow-sm"
				>
					{cancelText}
				</button>
				<button
					onclick={handleConfirm}
					class={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-sm ${
						danger 
							? 'bg-red-600 hover:bg-red-700 text-white' 
							: 'bg-blue-600 hover:bg-blue-700 text-white'
					}`}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}

	.animate-slideUp {
		animation: slideUp 0.2s ease-out;
	}
</style>
