export default function SocialLogin() {
  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[--outline-variant]"></div></div>
        <div className="relative bg-white px-4 text-[12px] font-bold text-[--on-surface-variant] uppercase tracking-widest">Or continue with</div>
      </div>
      <div className="flex gap-3">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[--outline-variant] rounded-xl hover:bg-[--surface-low] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span className="text-[14px] font-bold text-[--on-surface]">Google</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[--outline-variant] rounded-xl hover:bg-[--surface-low] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"/>
            <path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-4.078,2.214-5.966,6.053-5.966c1.711,0,3.185,0.123,3.617,0.18L35.6,16.58c-0.207-0.024-0.893-0.08-1.79-0.08c-1.921,0-2.81,0.92-2.81,2.793V21h4.485L34.368,25z"/>
          </svg>
          <span className="text-[14px] font-bold text-[--on-surface]">Facebook</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[--outline-variant] rounded-xl hover:bg-[--surface-low] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16px" height="16px">
            <path fill="#000000" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L273 181.6 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
          </svg>
          <span className="text-[14px] font-bold text-[--on-surface]">X</span>
        </button>
      </div>
    </div>
  );
}
