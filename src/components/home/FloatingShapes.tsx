export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/15 rounded-full blur-3xl animate-float"
           style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/10 rotate-45 blur-2xl animate-float"
           style={{ animationDelay: '1s' }} />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-glow blur-3xl opacity-30 animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-glow blur-3xl opacity-20 animate-pulse-glow"
           style={{ animationDelay: '1.5s' }} />
    </div>
  );
};