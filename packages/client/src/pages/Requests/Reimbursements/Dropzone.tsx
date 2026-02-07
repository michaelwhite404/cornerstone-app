import { PaperClipIcon, TrashIcon } from "@heroicons/react/outline";
import pluralize from "pluralize";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToasterContext } from "../../../hooks";

interface CustomFile extends File {
  preview: string;
}

interface DropzoneProps {
  maxFiles?: number;
  onFilesChange: (files: CustomFile[]) => void;
}

export default function Dropzone(props: DropzoneProps) {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const { showToaster } = useToasterContext();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles) => {
      if (
        props.maxFiles &&
        props.maxFiles > 0 &&
        files.length + acceptedFiles.length > props.maxFiles
      ) {
        return showToaster(
          `You can only upload ${pluralize("file", props.maxFiles, true)}`,
          "danger"
        );
      }
      const newFiles = [
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ];
      setFiles(newFiles);
      props.onFilesChange?.(newFiles);
    },
  });

  const deleteFile = (file: CustomFile) => {
    const newFiles = files.filter((f) => f.preview !== file.preview);
    setFiles(newFiles);
    props.onFilesChange?.(newFiles);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const createCount = () => {
    const count = files.length.toString();
    if (props.maxFiles === undefined) {
      return pluralize("file", +count, true);
    }
    return `${count} / ${pluralize("file", props.maxFiles, true)}`;
  };

  const images = files.map((file) => (
    <div key={file.preview} className="p-3 border border-gray-200 rounded-lg mt-2 relative">
      <div className="flex">
        <div className="flex align-center mr-3 h-8 w-8">
          <img width={50} src={file.preview} alt="" />
        </div>
        <div className="">
          <div className="font-medium">{file.name}</div>
          <div className="text-gray-400 text-xs">{formatBytes(file.size, 1)}</div>
          <button className="absolute top-4 right-4" onClick={() => deleteFile(file)}>
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ));

  const showDropzone = props.maxFiles ? props.maxFiles > files.length : true;

  return (
    <div>
      {showDropzone && (
        <div
          {...getRootProps({
            className:
              "dropzone  cursor-pointer select-none flex flex-col items-center pointer border-2 border-gray-200 border-dashed rounded-lg p-6 sm:p-12 text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          })}
        >
          <input {...getInputProps()} />
          <PaperClipIcon className="h-12 w-12 mb-2" />
          <div className="font-semibold">Drag your document or file here</div>
          <p>or click to browse for a file</p>
        </div>
      )}
      <div>
        <div>{images}</div>
      </div>
      <div className="flex mt-3 pr-3 justify-end w-full text-gray-500">{createCount()}</div>
    </div>
  );
}
