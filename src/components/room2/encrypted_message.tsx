interface EncryptedMessageProps {
  message: string;
  source: string;
}

export function EncryptedMessage({ message, source }: EncryptedMessageProps) {
  return (
    <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm font-semibold">ENCRYPTED DATA</span>
      </div>
      
      <div className="text-green-400 text-xs mb-2">
        Source: {source}
      </div>
      
      <div className="bg-black border border-gray-600 rounded p-3 font-mono text-sm">
        <div className="text-green-300 mb-2">--- BEGIN ENCRYPTED MESSAGE ---</div>
        <div className="text-green-400 leading-relaxed break-all">
          {message}
        </div>
        <div className="text-green-300 mt-2">--- END ENCRYPTED MESSAGE ---</div>
      </div>
      
      <div className="mt-3 text-yellow-400 text-xs">
        ⚠️ This appears to be a Caesar cipher. Try different shift values to decode.
      </div>
    </div>
  );
}
