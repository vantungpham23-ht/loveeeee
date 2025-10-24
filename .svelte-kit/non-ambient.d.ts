
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/albums" | "/albums/[id]" | "/api" | "/api/upload-avatar" | "/api/upload" | "/auth" | "/auth/callback" | "/profile" | "/settings" | "/test" | "/upload";
		RouteParams(): {
			"/albums/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/albums": { id?: string };
			"/albums/[id]": { id: string };
			"/api": Record<string, never>;
			"/api/upload-avatar": Record<string, never>;
			"/api/upload": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/callback": Record<string, never>;
			"/profile": Record<string, never>;
			"/settings": Record<string, never>;
			"/test": Record<string, never>;
			"/upload": Record<string, never>
		};
		Pathname(): "/" | "/albums" | "/albums/" | `/albums/${string}` & {} | `/albums/${string}/` & {} | "/api" | "/api/" | "/api/upload-avatar" | "/api/upload-avatar/" | "/api/upload" | "/api/upload/" | "/auth" | "/auth/" | "/auth/callback" | "/auth/callback/" | "/profile" | "/profile/" | "/settings" | "/settings/" | "/test" | "/test/" | "/upload" | "/upload/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}