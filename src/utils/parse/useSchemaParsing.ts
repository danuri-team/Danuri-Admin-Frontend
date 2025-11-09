// Helper Functions
export const parseSignUpFormSchema = (schemaString: string): Record<string, unknown> | null => {
  if (!schemaString) return null;

  try {
    const schema = JSON.parse(schemaString);
    delete schema.id;
    return schema;
  } catch (error) {
    console.error("[다누리] 폼 응답 값 파싱에 실패했어요:", error);
    return null;
  }
};