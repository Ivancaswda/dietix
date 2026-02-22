export const uploadProfileImage = async (file: File) => {
    try {
        const authRes = await fetch("/api/imagekit/auth");
        const auth = await authRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", `doctor_${Date.now()}`);
        formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);
        formData.append("folder", "/doctors");

        const uploadRes = await fetch(
            "https://upload.imagekit.io/api/v1/files/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!uploadRes.ok) {
            throw new Error("UPLOAD_FAILED");
        }

        return uploadRes.json();
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};
