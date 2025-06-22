// src/components/Skeleton.jsx
const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse delay-75 bg-gray-300 dark:bg-gray-700 rounded ${className}`}
    />
  );
};

export default Skeleton;
