<!--
	@component
	Calendar month view component that displays training sessions.
	
	## Features
	- Shows current month by default
	- Navigation to previous/next months
	- Highlights days with training sessions
	- Click on day with session to view details
	- Shows current day indicator
	- Responsive grid layout
	
	## Props
	- sessions: Array of session objects with dates
	- currentMonth: Optional Date object for initial month
	
	@example
	<CalendarView sessions={data.sessions} />
-->
<script lang="ts">
	import { goto } from '$app/navigation';

	let { sessions = [] } = $props<{
		sessions: Array<{
			id: string;
			session_date: number;
			start_time: string;
			duration: number;
		}>;
	}>();

	let currentDate = $state(new Date());
	let viewMonth = $state(new Date().getMonth());
	let viewYear = $state(new Date().getFullYear());

	// Get days in month
	function getDaysInMonth(month: number, year: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	// Get first day of month (0 = Sunday, 1 = Monday, etc.)
	function getFirstDayOfMonth(month: number, year: number) {
		return new Date(year, month, 1).getDay();
	}

	// Create session map for quick lookup
	const sessionsByDate = $derived(() => {
		const map = new Map<string, typeof sessions>();
		sessions.forEach((session: any) => {
			const date = new Date(session.session_date);
			const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
			if (!map.has(key)) {
				map.set(key, []);
			}
			map.get(key)!.push(session);
		});
		return map;
	});

	// Generate calendar grid
	const calendarDays = $derived(() => {
		const daysInMonth = getDaysInMonth(viewMonth, viewYear);
		const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
		const days: Array<{
			day: number | null;
			isCurrentMonth: boolean;
			isToday: boolean;
			hasSessions: boolean;
			sessions: any[];
		}> = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDay; i++) {
			days.push({
				day: null,
				isCurrentMonth: false,
				isToday: false,
				hasSessions: false,
				sessions: []
			});
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const dateKey = `${viewYear}-${viewMonth}-${day}`;
			const sessionsForDay = sessionsByDate().get(dateKey) || [];
			const isToday =
				day === currentDate.getDate() &&
				viewMonth === currentDate.getMonth() &&
				viewYear === currentDate.getFullYear();

			days.push({
				day,
				isCurrentMonth: true,
				isToday,
				hasSessions: sessionsForDay.length > 0,
				sessions: sessionsForDay
			});
		}

		return days;
	});

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	function previousMonth() {
		if (viewMonth === 0) {
			viewMonth = 11;
			viewYear--;
		} else {
			viewMonth--;
		}
	}

	function nextMonth() {
		if (viewMonth === 11) {
			viewMonth = 0;
			viewYear++;
		} else {
			viewMonth++;
		}
	}

	function goToToday() {
		viewMonth = currentDate.getMonth();
		viewYear = currentDate.getFullYear();
	}

	function handleDayClick(day: { day: number | null; hasSessions: boolean; sessions: any[] }) {
		if (day.hasSessions && day.sessions.length > 0) {
			// Navigate to the first session for that day
			goto(`/sessions/${day.sessions[0].id}`);
		}
	}
</script>

<div class="bg-white rounded-lg">
	<!-- Calendar Header -->
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-bold text-slate-900">
			{monthNames[viewMonth]}
			{viewYear}
		</h2>
		<div class="flex items-center gap-2">
			<button
				onclick={goToToday}
				class="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
			>
				Today
			</button>
			<button
				onclick={previousMonth}
				class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
				aria-label="Previous month"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<button
				onclick={nextMonth}
				class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
				aria-label="Next month"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Day Labels -->
	<div class="grid grid-cols-7 gap-1 mb-1">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayName}
			<div class="text-center text-[10px] font-semibold text-slate-500 py-1">
				{dayName}
			</div>
		{/each}
	</div>

	<!-- Calendar Grid -->
	<div class="grid grid-cols-7 gap-1">
		{#each calendarDays() as day}
			{#if day.day === null}
				<!-- Empty cell -->
				<div class="aspect-square"></div>
			{:else}
				<button
					onclick={() => handleDayClick(day)}
					class="aspect-square p-1 rounded transition-all relative group text-xs"
					class:bg-blue-50={day.isToday && !day.hasSessions}
					class:ring-1={day.isToday}
					class:ring-blue-500={day.isToday}
					class:bg-green-100={day.hasSessions}
					class:hover:bg-green-200={day.hasSessions}
					class:hover:bg-slate-100={!day.hasSessions}
					class:cursor-pointer={day.hasSessions}
					disabled={!day.hasSessions}
				>
					<div class="flex flex-col items-center justify-center h-full">
						<span
							class="font-medium"
							class:text-blue-600={day.isToday}
							class:text-slate-900={!day.isToday && day.isCurrentMonth}
							class:text-slate-400={!day.isCurrentMonth}
						>
							{day.day}
						</span>
						{#if day.hasSessions}
							<div class="flex gap-0.5 mt-0.5">
								{#each day.sessions.slice(0, 3) as _}
									<div class="w-0.5 h-0.5 bg-green-600 rounded-full"></div>
								{/each}
							</div>
							<!-- Tooltip on hover -->
							<div
								class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
							>
								{day.sessions.length} session{day.sessions.length > 1 ? 's' : ''}
							</div>
						{/if}
					</div>
				</button>
			{/if}
		{/each}
	</div>

	<!-- Legend -->
	<div class="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
		<div class="flex items-center gap-1.5">
			<div class="w-3 h-3 bg-blue-50 ring-1 ring-blue-500 rounded"></div>
			<span class="text-slate-600">Today</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-3 h-3 bg-green-100 rounded"></div>
			<span class="text-slate-600">Training Session</span>
		</div>
	</div>
</div>
