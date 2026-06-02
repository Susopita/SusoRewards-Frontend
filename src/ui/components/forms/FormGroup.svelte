<script lang="ts">
  interface Props {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: any;
    disabled?: boolean;
    required?: boolean;
    maxlength?: number;
    step?: string;
    min?: string;
  }

  let {
    id,
    label,
    type = 'text',
    placeholder = '',
    value = $bindable(),
    disabled = false,
    required = false,
    maxlength,
    step,
    min
  }: Props = $props();
</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input
    {type}
    {id}
    bind:value={value}
    {placeholder}
    {disabled}
    {required}
    {maxlength}
    {step}
    {min}
  />
</div>

