export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-16 h-4">
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "0.5s",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animation: "shift 1.5s infinite ease-in-out",
            animationDelay: "1s",
          }}
        ></div>
      </div>
    </div>
  );
}
