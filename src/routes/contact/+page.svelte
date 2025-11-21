<script lang="ts">
	import NavIcon from '$lib/components/NavIcon.svelte';

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	let showBanner = $state(false);

	function handleSubmit(event: Event) {
		event.preventDefault();
		
		// In a real app, you'd send this data to a server
		console.log('Form submitted:', formData);
		
		// Show success banner
		showBanner = true;
		
		// Reset form
		formData = { name: '', email: '', message: '' };
		
		// Hide banner after 5 seconds
		setTimeout(() => {
			showBanner = false;
		}, 5000);
	}
</script>

<div class="max-w-4xl">
	<h1 class="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
	<p class="text-lg text-slate-600 mb-6">
		Have questions or feedback? We'd love to hear from you!
	</p>

	<div class="grid md:grid-cols-2 gap-6">
		<!-- Contact Form -->
		<div class="flex">
			<form onsubmit={handleSubmit} class="bg-white rounded-lg shadow p-6 flex-1 flex flex-col">
					<h2 class="text-2xl font-semibold text-slate-800 mb-4">Send us a message</h2>
					
					<div class="flex-1 flex flex-col">
						<div class="flex flex-col mb-6">
							<label for="name" class="text-sm font-semibold text-slate-700 mb-2">
								Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="John Doe"
							/>
						</div>

						<div class="flex flex-col mb-6">
							<label for="email" class="text-sm font-semibold text-slate-700 mb-2">
								Email <span class="text-red-500">*</span>
							</label>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								required
								class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="john@example.com"
							/>
						</div>

						<div class="flex flex-col mb-6">
							<label for="message" class="text-sm font-semibold text-slate-700 mb-2">
								Message <span class="text-red-500">*</span>
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
								placeholder="Tell us what's on your mind..."
							></textarea>
						</div>

						<button
							type="submit"
							class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mt-auto"
						>
							Send Message
						</button>
					</div>
				</form>
		</div>

		<!-- Contact Information -->
		<div class="flex">
			<div class="bg-slate-100 rounded-lg p-6 flex-1 flex flex-col">
				<h2 class="text-2xl font-semibold text-slate-800 mb-4">Get in touch</h2>
				<p class="text-slate-700 mb-6">
					Prefer a different way to reach out? Here are some alternative contact methods.
				</p>

				<div class="space-y-4">
					<div class="flex items-center gap-4">
						<NavIcon
							path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							class="h-6 w-6 text-slate-700 flex-shrink-0"
						/>
						<div>
							<p class="font-semibold text-slate-800">Email</p>
							<p class="text-slate-700">hello@example.com</p>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<NavIcon
							path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							class="h-6 w-6 text-slate-700 flex-shrink-0"
						/>
						<div>
							<p class="font-semibold text-slate-800">Phone</p>
							<p class="text-slate-700">(555) 123-4567</p>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<NavIcon
							path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							class="h-6 w-6 text-slate-700 flex-shrink-0"
						/>
						<div>
							<p class="font-semibold text-slate-800">Location</p>
							<p class="text-slate-700">San Francisco, CA</p>
						</div>
					</div>
				</div>

				<div class="mt-6 pt-6 border-t border-slate-300">
					<h3 class="font-semibold text-slate-800 mb-2">Office Hours</h3>
					<div class="text-slate-700 space-y-1">
						<p>Monday - Friday: 9:00 AM - 6:00 PM</p>
						<p>Saturday: 10:00 AM - 4:00 PM</p>
						<p>Sunday: Closed</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Success Banner -->
{#if showBanner}
	<div
		class="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down"
		role="alert"
		aria-live="polite"
	>
		<div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-96">
			<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div class="flex-1">
				<p class="font-semibold">Message sent successfully!</p>
				<p class="text-sm opacity-90">We'll get back to you as soon as possible.</p>
			</div>
			<button
				onclick={() => (showBanner = false)}
				class="ml-2 text-white hover:text-green-100 transition-colors flex-shrink-0"
				aria-label="Close notification"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-down {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-down {
		animation: slide-down 0.3s ease-out;
	}
</style>
