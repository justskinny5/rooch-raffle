const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 100 * 1024) {
      // 限制文件大小不超过 100KB
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setCoverImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      alert(t('imageUpload.sizeLimit'));
    }
};