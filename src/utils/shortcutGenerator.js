// Helper module for iOS native deletion workflow & Shortcut instructions

export function generateDeletionReport(trashItems) {
  if (!trashItems || trashItems.length === 0) {
    return { text: 'No items in trash.', fileNames: [] };
  }

  const fileNames = trashItems.map(item => item.name);
  const totalBytes = trashItems.reduce((sum, item) => sum + item.size, 0);

  const reportText = `SwipeClean Deletion List
-----------------------------
Total Storage Saved: ${(totalBytes / (1024 * 1024)).toFixed(1)} MB
Total Items to Delete: ${trashItems.length}

Files:
${fileNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

iOS Instructions:
1. Open iOS Photos app.
2. Tap "Search" and paste the file names or search dates.
3. Select and delete to reclaim system storage!`;

  return {
    text: reportText,
    fileNames: fileNames,
    totalItems: trashItems.length,
    totalBytes: totalBytes
  };
}

export function downloadReportAsFile(trashItems) {
  const report = generateDeletionReport(trashItems);
  const blob = new Blob([report.text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SwipeClean_Deletion_List_${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
